import { createAuthClient } from "better-auth/react";

// Same origin as the page. The server allowlist (routes/api/auth/$.ts) limits what it can reach.
export const authClient = createAuthClient();
