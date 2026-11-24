import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import type { Database } from "@cairn/db";
import * as schema from "@cairn/db/schema/auth";
import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export type AuthConfig = {
  APP_ORIGIN: string;
  APP_ENV: "development" | "test" | "production";
  BETTER_AUTH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  // Test stage only: HMAC key that signs the fake Google ID tokens. Production never sets it.
  GOOGLE_TEST_ID_TOKEN_SECRET?: string;
};

const encoder = new TextEncoder();

function base64UrlToBytes(value: string) {
  const padded = value
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");

  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

// Test stage only. Google's signature check uses Google's JWKS, which a test cannot reach. This
// verifier keeps the other checks (issuer, audience, expiry) and replaces only the signature key.
async function verifyTestGoogleIdToken(token: string, secret: string, clientId: string) {
  const parts = token.split(".");

  if (parts.length !== 3) return false;

  // SAFETY: the length check above guarantees three segments, so each destructured part is a string.
  const [header, payload, signature] = parts as [string, string, string];

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const signed = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlToBytes(signature),
    encoder.encode(header + "." + payload),
  );

  if (!signed) return false;

  // SAFETY: the signature is verified above, so the payload is the token this test secret issued.
  // Each claim is still compared on its own below, so a wrong type fails the comparison.
  const claims = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as {
    iss?: string;
    aud?: string;
    exp?: number;
  };

  return (
    (claims.iss === "https://accounts.google.com" || claims.iss === "accounts.google.com") &&
    claims.aud === clientId &&
    claims.exp !== undefined &&
    Number.isFinite(claims.exp) &&
    claims.exp * 1000 > Date.now()
  );
}

export function authOptions(env: AuthConfig, database: Database) {
  const testSecret =
    env.APP_ENV === "test" && env.GOOGLE_TEST_ID_TOKEN_SECRET
      ? env.GOOGLE_TEST_ID_TOKEN_SECRET
      : undefined;

  // Only the test environment with a test secret replaces Google's signature check.
  const verifyIdToken = testSecret
    ? (token: string) => verifyTestGoogleIdToken(token, testSecret, env.GOOGLE_CLIENT_ID)
    : undefined;

  return {
    database: drizzleAdapter(database, { provider: "pg", schema }),
    trustedOrigins: [env.APP_ORIGIN],
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.APP_ORIGIN,
    // A failed or cancelled sign-in returns to the sign-in page (the app's root), not to Better Auth's JSON error route.
    onAPIError: { errorURL: "/" },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        verifyIdToken,
      },
    },
    session: { cookieCache: { enabled: false } },
    plugins: [tanstackStartCookies()],
  };
}

export function createAuth(env: AuthConfig, database: Database) {
  return betterAuth(authOptions(env, database));
}

export type Auth = ReturnType<typeof createAuth>;
