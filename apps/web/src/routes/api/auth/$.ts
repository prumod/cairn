import { createFileRoute } from "@tanstack/react-router";
import { getRuntime } from "../../../server/runtime.server.js";

// Only these method and path pairs reach better-auth. Every other path answers 404.
const allowedRoutes = [
  { method: "POST", path: "/api/auth/sign-in/social" },
  { method: "GET", path: "/api/auth/callback/google" },
  { method: "GET", path: "/api/auth/get-session" },
  { method: "POST", path: "/api/auth/sign-out" },
] as const;

function notFound() {
  return Response.json(
    { error: "Not found." },
    { status: 404, headers: { "Cache-Control": "no-store" } },
  );
}

async function handle(request: Request) {
  const path = new URL(request.url).pathname.replace(/\/$/, "");

  const allowed = allowedRoutes.some(
    (route) => route.method === request.method && route.path === path,
  );

  if (!allowed) return notFound();

  return (await getRuntime()).auth.handler(request);
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
      PUT: () => notFound(),
      PATCH: () => notFound(),
      DELETE: () => notFound(),
    },
  },
});
