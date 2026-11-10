import { createHmac } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import type { APIRequestContext, BrowserContext } from "@playwright/test";

// Test values only. They configure the disposable test Worker; no production or Google credential
// is read or written here. Google's signature check is replaced in the test stage only (see
// packages/auth/src/index.ts), and every other check still runs.
export const testAuthSettings = {
  betterAuthSecret: "test-only-better-auth-secret-0123456789abcdef",
  googleClientId: "test-only.apps.googleusercontent.com",
  googleClientSecret: "test-only-google-client-secret",
  googleTestIdTokenSecret: "test-only-google-id-token-signing-key",
  bootstrapAdministratorEmail: "helena@exemplo.test",
} as const;

export type FakeGoogleIdentity = {
  sub: string;
  email: string;
  emailVerified: boolean;
  name: string;
};

// Builds an ID token that Google's claims layout describes, signed with the test key.
export function createFakeGoogleIdToken(identity: FakeGoogleIdentity) {
  const encode = (claims: Record<string, string | number | boolean>) =>
    Buffer.from(JSON.stringify(claims)).toString("base64url");

  const now = Math.floor(Date.now() / 1000);
  const header = encode({ alg: "HS256", typ: "JWT" });

  const payload = encode({
    iss: "https://accounts.google.com",
    aud: testAuthSettings.googleClientId,
    azp: testAuthSettings.googleClientId,
    sub: identity.sub,
    email: identity.email,
    email_verified: identity.emailVerified,
    name: identity.name,
    iat: now,
    exp: now + 3600,
  });

  const signature = createHmac("sha256", testAuthSettings.googleTestIdTokenSecret)
    .update(header + "." + payload)
    .digest("base64url");

  return header + "." + payload + "." + signature;
}

// Signs in through the public Better Auth route, as the browser's button would after Google.
// Returns the session cookies so the browser can continue as that person.
export async function signInWithFakeGoogle(
  request: APIRequestContext,
  origin: string,
  identity: FakeGoogleIdentity,
) {
  const idToken = createFakeGoogleIdToken(identity);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await request.post(origin + "/api/auth/sign-in/social", {
      headers: { Origin: origin, Referer: origin + "/" },
      data: { provider: "google", idToken: { token: idToken } },
      maxRedirects: 0,
      timeout: 15_000,
    });

    const status = response.status();
    const retryAfter = response.headers()["retry-after"];

    const cookies = response
      .headersArray()
      .filter((header) => header.name.toLowerCase() === "set-cookie")
      .map((header) => header.value.split(";")[0]!)
      .map((pair) => {
        const index = pair.indexOf("=");

        return { name: pair.slice(0, index), value: pair.slice(index + 1) };
      });

    await response.dispose();

    if (status === 200) return cookies;

    // Only an explicit rate-limit rejection is retried. The limit itself is never relaxed.
    if (status !== 429 || attempt === 2 || !retryAfter || !/^\d+$/.test(retryAfter))
      throw new Error("Test sign-in failed (HTTP " + status + ").");

    await delay(Number(retryAfter) * 1000);
  }

  throw new Error("Test sign-in failed after retries.");
}

export async function addSessionCookies(
  context: BrowserContext,
  origin: string,
  cookies: { name: string; value: string }[],
) {
  await context.addCookies(cookies.map((cookie) => ({ ...cookie, url: origin })));
}
