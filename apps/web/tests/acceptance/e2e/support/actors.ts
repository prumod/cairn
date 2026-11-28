import type { Browser, BrowserContext, Page } from "@playwright/test";

// Must match baseURL in playwright.config.ts.
export const ORIGIN = "http://127.0.0.1:4173";

type Actor = { context: BrowserContext; page: Page };

// The browser of each person in the scenario, by name. Cleared by closeActors.
const actors = new Map<string, Actor>();

export async function actorFor(browser: Browser, name: string): Promise<Actor> {
  const existing = actors.get(name);

  if (existing) return existing;

  const context = await browser.newContext({ baseURL: ORIGIN });
  const actor = { context, page: await context.newPage() };

  actors.set(name, actor);

  return actor;
}

export function actorNamed(name: string): Actor | undefined {
  return actors.get(name);
}

// Sets the system colour scheme the person's browser reports, and keeps it for later navigations.
export async function setSystemScheme(browser: Browser, name: string, scheme: "light" | "dark") {
  const { page } = await actorFor(browser, name);

  await page.emulateMedia({ colorScheme: scheme });
}

export async function closeActors() {
  for (const actor of actors.values()) await actor.context.close();

  actors.clear();
}
