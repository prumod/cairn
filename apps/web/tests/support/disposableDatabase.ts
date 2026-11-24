import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { createDb, type Database } from "@cairn/db";
import { migrate } from "drizzle-orm/neon-http/migrator";

// A fresh database with every migration applied, reached through the same Neon HTTP proxy the
// application uses. Requires the PostgreSQL test wrapper (TEST_DATABASE_URL, TEST_NEON_PORT).
export async function createDisposableDatabase(migrationsFolder?: string) {
  const connectionString = process.env.TEST_DATABASE_URL;
  const neonPort = process.env.TEST_NEON_PORT;

  if (!connectionString || !neonPort) throw new Error("Run tests via the PostgreSQL test wrapper.");

  const name = "cairn_disposable_" + randomUUID().replaceAll("-", "");
  const identifier = pg.escapeIdentifier(name);
  const root = new pg.Pool({ connectionString });

  try {
    await root.query("CREATE DATABASE " + identifier);

    const url = new URL(connectionString);
    url.pathname = "/" + name;
    url.hostname = "db.localtest.me";
    url.port = neonPort;

    const db: Database = createDb({ DATABASE_URL: url.toString() });

    await migrate(db, {
      migrationsFolder:
        migrationsFolder ??
        fileURLToPath(new URL("../../../../packages/db/migrations", import.meta.url)),
    });

    return {
      db,
      async close() {
        try {
          await root.query("DROP DATABASE " + identifier + " WITH (FORCE)");
        } finally {
          await root.end();
        }
      },
    };
  } catch (error) {
    await root.query("DROP DATABASE IF EXISTS " + identifier + " WITH (FORCE)").catch(() => {});
    await root.end();
    throw error;
  }
}
