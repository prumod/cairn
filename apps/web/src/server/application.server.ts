import { sql } from "drizzle-orm";
import { getRuntime } from "./runtime.server.js";
import { ENV } from "../env.server.js";
import { DependencyUnavailable, handleRequest } from "./shared/observability/observability.js";
import { publicAnalyticsConfig } from "./shared/observability/analyticsConfig.js";

function json<Body>(value: Body, status = 200) {
  return Response.json(value, { status, headers: { "Cache-Control": "no-store" } });
}

function protect(operation: string, action: () => Promise<Response>) {
  return handleRequest(operation, ENV.GIT_SHA ?? "local", action);
}

export function getHealth() {
  return protect("health", async () => {
    const runtime = getRuntime();

    try {
      await runtime.db.execute(sql.raw("SELECT 1"));
    } catch (error) {
      throw new DependencyUnavailable(error);
    }

    return json({ status: "ready", revision: runtime.config.revision });
  });
}

export function getAnalyticsConfig() {
  return protect("get_analytics_config", async () =>
    json(publicAnalyticsConfig(ENV.DEPLOYMENT_STAGE, ENV.POSTHOG_PROJECT_TOKEN)),
  );
}
