import { randomUUID } from "node:crypto";
import { spawn, type ChildProcess } from "node:child_process";
import { createServer as createNetServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { z } from "zod";
import { createDb } from "@cairn/db";
import { migrate } from "drizzle-orm/neon-http/migrator";

const environmentKeys = ["APP_ORIGIN", "DATABASE_URL", "GIT_SHA", "NODE_ENV"] as const;

const ListeningAddress = z.object({ port: z.number() });

const Health = z.object({ status: z.literal("ready") });

async function findAvailablePort(requested: number) {
  if (requested !== 0) return requested;
  const server = createNetServer();
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = ListeningAddress.safeParse(server.address());

  if (!address.success) throw new Error("No available test port.");
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );

  return address.data.port;
}

function captureOutput(child: ChildProcess) {
  const lines: string[] = [];

  const record = (chunk: Buffer) => {
    lines.push(chunk.toString());

    if (lines.length > 40) lines.shift();
  };

  child.stdout?.on("data", record);
  child.stderr?.on("data", record);

  return () => lines.join("");
}

async function stop(child: ChildProcess | undefined) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  const closed = new Promise<void>((resolve) => child.once("close", () => resolve()));

  if (process.platform === "win32") child.kill("SIGTERM");
  else if (child.pid) process.kill(-child.pid, "SIGTERM");
  let timer: NodeJS.Timeout | undefined;

  const stopped = await Promise.race([
    closed.then(() => true),
    new Promise<false>((resolve) => {
      timer = setTimeout(() => resolve(false), 10_000);
    }),
  ]);

  if (timer) clearTimeout(timer);

  if (!stopped) {
    if (process.platform === "win32") child.kill("SIGKILL");
    else if (child.pid) process.kill(-child.pid, "SIGKILL");
    await closed;
  }
}

export async function createTestApplication(requestedPort = 0) {
  const connectionString = process.env.TEST_DATABASE_URL;

  if (!connectionString) throw new Error("Run tests via the PostgreSQL test wrapper.");

  const previousEnvironment = new Map(
    environmentKeys.map((key) => [key, process.env[key]] as const),
  );

  const name = "cairn_test_" + randomUUID().replaceAll("-", "");
  const identifier = pg.escapeIdentifier(name);
  const rootPool = new pg.Pool({ connectionString });
  let pool: pg.Pool | undefined;
  let appServer: ChildProcess | undefined;
  let databaseCreated = false;

  async function restoreEnvironment() {
    for (const key of environmentKeys) {
      const value = previousEnvironment.get(key);

      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }

  async function cleanup() {
    const errors: unknown[] = [];

    async function attempt(operation: () => Promise<void>) {
      try {
        await operation();
      } catch (error) {
        errors.push(error);
      }
    }

    await attempt(() => stop(appServer));

    if (pool) await attempt(() => pool!.end());

    if (databaseCreated) {
      await attempt(async () => {
        // Neon’s HTTP proxy keeps pooled connections after the Worker stops.
        await rootPool.query({ text: "DROP DATABASE " + identifier + " WITH (FORCE)" });
      });
    }

    await attempt(() => rootPool.end());
    await attempt(restoreEnvironment);

    if (errors.length > 0) throw new AggregateError(errors, "Test application cleanup failed.");
  }

  try {
    await rootPool.query({ text: "CREATE DATABASE " + identifier });
    databaseCreated = true;
    const url = new URL(connectionString);
    url.pathname = "/" + name;
    pool = new pg.Pool({ connectionString: url.toString() });
    const neonPort = process.env.TEST_NEON_PORT;

    if (!neonPort) throw new Error("Run tests via the disposable PostgreSQL/Neon proxy wrapper.");
    const neonURL = new URL(url);
    neonURL.hostname = "db.localtest.me";
    neonURL.port = neonPort;
    const db = createDb({ DATABASE_URL: neonURL.toString() });
    await migrate(db, {
      migrationsFolder: fileURLToPath(
        new URL("../../../../packages/db/migrations", import.meta.url),
      ),
    });

    const port = await findAvailablePort(requestedPort);
    const origin = "http://127.0.0.1:" + port;

    const environment = {
      APP_ORIGIN: origin,
      DATABASE_URL: neonURL.toString(),
      GIT_SHA: "0123456789abcdef0123456789abcdef01234567",
      HOST: "127.0.0.1",
      NODE_ENV: "test",
      PORT: String(port),
    };

    Object.assign(process.env, environment);

    const infraRoot = fileURLToPath(new URL("../../../../packages/infra/", import.meta.url));
    appServer = spawn(
      "bun",
      [
        "node_modules/alchemy/bin/cli.js",
        "dev",
        "test/alchemy.run.ts",
        "--stage",
        "test-" + name,
        "--env-file",
        process.platform === "win32" ? "NUL" : "/dev/null",
      ],
      {
        cwd: infraRoot,
        env: { ...environment, HOME: process.env.HOME, PATH: process.env.PATH },
        detached: process.platform !== "win32",
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    const output = captureOutput(appServer);

    const exited = new Promise<never>((_resolve, reject) => {
      appServer!.once("error", reject);
      appServer!.once("close", (code, signal) => {
        reject(new Error(`TanStack Start server exited (${String(code ?? signal)}): ${output()}`));
      });
    });

    let ready = false;
    let lastObservation = "no response";
    const deadline = Date.now() + 180_000;

    while (!ready && Date.now() < deadline) {
      const response = await Promise.race([
        fetch(origin + "/healthz", {
          headers: { Origin: origin },
          signal: AbortSignal.timeout(1_500),
        }).catch(() => null),
        exited,
      ]);

      if (response) {
        const contentType = response.headers.get("content-type") ?? "unknown content type";
        const body = await response.text().catch(() => "unreadable response");
        lastObservation = `HTTP ${response.status} (${contentType}): ${body.slice(0, 160)}`;

        if (response.status >= 500 && response.status !== 503) {
          throw new Error(`TanStack Start returned ${lastObservation}: ${output()}`);
        }

        try {
          if (response.ok && Health.safeParse(JSON.parse(body)).success) {
            ready = true;
            break;
          }
        } catch {
          // Continue until the app responds with its database-backed readiness state.
        }
      }

      await delay(100);
    }

    if (!ready) {
      throw new Error(`TanStack Start server was not ready (${lastObservation}): ${output()}`);
    }

    return {
      db,
      origin,
      baseURL: origin,
      request<Body>(
        path: string,
        cookie = "",
        method = "GET",
        body?: Body,
        requestOrigin = origin,
      ) {
        const init: RequestInit = {
          method,
          headers: {
            cookie,
            origin: requestOrigin,
            "content-type": "application/json",
          },
        };

        if (body !== undefined) init.body = JSON.stringify(body);

        return fetch(origin + path, init);
      },
      async reset() {
        await pool!.query({
          text: 'TRUNCATE TABLE company_profile, session, account, verification, user_access, "user" RESTART IDENTITY CASCADE',
        });
      },
      close: cleanup,
    };
  } catch (error) {
    try {
      await cleanup();
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], "Test startup and cleanup failed.");
    }

    throw error;
  }
}

export type TestApplication = Awaited<ReturnType<typeof createTestApplication>>;
