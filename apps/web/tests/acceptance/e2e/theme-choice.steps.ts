import { expect, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { actorFor, setSystemScheme } from "./support/actors.js";

type Scheme = "light" | "dark";

const SHOW = { timeout: 30_000 };

const { Given, When, Then } = createBdd();

declare global {
  interface Window {
    // Set by recordFirstBodyTheme in each loaded document.
    cairnFirstBodyTheme?: string;
  }
}

// Runs before the page's own markup. Records the theme on <html> at the moment <body> first exists, which is before the page's content is painted.
const recordFirstBodyTheme = `
new MutationObserver(function (_mutations, observer) {
  if (!document.body) return;
  observer.disconnect();
  window.cairnFirstBodyTheme = document.documentElement.dataset.theme || "";
}).observe(document, { childList: true, subtree: true });
`;

const legalPaths = new Map([
  ["a política de privacidade", "/privacy"],
  ["os termos de utilização", "/terms"],
]);

function schemeOf(theme: string): Scheme {
  if (theme === "claro") return "light";

  if (theme === "escuro") return "dark";

  throw new Error("Unknown theme: " + theme);
}

// The colour scheme the page shows: the stylesheet's, under data-theme or the system preference.
async function shownScheme(page: Page): Promise<Scheme> {
  const scheme = await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);

  if (scheme === "light" || scheme === "dark") return scheme;

  throw new Error("The page shows no light or dark colour scheme: " + scheme);
}

// The choice the visitor saved, as data-theme on <html>. Absent when the system preference applies.
function savedChoice(page: Page): Promise<string | undefined> {
  return page.evaluate(() => document.documentElement.dataset.theme);
}

function themeToggle(page: Page) {
  return page.getByRole("button", { name: "Modo escuro", exact: true });
}

// The toggle acts only once React has hydrated the page, so a click that lands earlier is retried.
async function chooseTheme(page: Page, scheme: Scheme) {
  await expect(async () => {
    if ((await savedChoice(page)) !== scheme) await themeToggle(page).click();

    expect(await savedChoice(page)).toBe(scheme);
  }).toPass(SHOW);
}

async function changeTheme(page: Page) {
  const before = await shownScheme(page);

  await expect(async () => {
    if ((await shownScheme(page)) === before) await themeToggle(page).click();

    expect(await shownScheme(page)).not.toBe(before);
  }).toPass(SHOW);
}

function legalLink(page: Page, label: string) {
  return page
    .getByRole("navigation", { name: "Informação legal" })
    .getByRole("link", { name: label, exact: true });
}

// Preconditions

Given(
  /^que o sistema d(?:a|o) (\p{L}+) prefere o tema (claro|escuro)$/u,
  async ({ browser }, name, theme) => {
    await setSystemScheme(browser, name, schemeOf(theme));
  },
);

Given(/^(?:a|o) (\p{L}+) ainda não escolheu um tema$/u, async ({ browser }, name) => {
  // A new browser has no saved choice.
  await actorFor(browser, name);
});

Given(/^(?:a|o) (\p{L}+) escolheu o tema (claro|escuro)$/u, async ({ browser }, name, theme) => {
  const { page } = await actorFor(browser, name);

  await page.goto("/");
  await chooseTheme(page, schemeOf(theme));
});

Given(/^(?:a|o) (\p{L}+) está na página inicial$/u, async ({ browser }, name) => {
  const { page } = await actorFor(browser, name);

  await page.goto("/");
});

Given(/^(?:que )?(?:a|o) (\p{L}+) não tem sessão iniciada$/u, async ({ browser }, name) => {
  // A new browser has no session.
  await actorFor(browser, name);
});

// Actions

When(
  /^o sistema d(?:a|o) (\p{L}+) passa a preferir o tema (claro|escuro)$/u,
  async ({ browser }, name, theme) => {
    await setSystemScheme(browser, name, schemeOf(theme));
  },
);

When(/^(?:a|o) (\p{L}+) muda o tema$/u, async ({ browser }, name) => {
  const { page } = await actorFor(browser, name);

  await changeTheme(page);
});

When(/^(?:a|o) (\p{L}+) recarrega a aplicação$/u, async ({ browser }, name) => {
  const { context, page } = await actorFor(browser, name);

  // Applies to the reload, which is the document the first-paint check reads.
  await context.addInitScript(recordFirstBodyTheme);
  await page.reload();
});

When(
  /^(?:a|o) (\p{L}+) abre (a política de privacidade|os termos de utilização)$/u,
  async ({ browser }, name, place) => {
    const { page } = await actorFor(browser, name);
    const path = legalPaths.get(place);

    if (!path) throw new Error("No legal page called " + place);

    await page.goto(path);
  },
);

When(/^(?:a|o) (\p{L}+) segue «([^»]+)» no rodapé$/u, async ({ browser }, name, label) => {
  const { page } = await actorFor(browser, name);

  await legalLink(page, label).click();
});

// Observations

Then(/^(?:a|o) (\p{L}+) vê o tema (claro|escuro)$/u, async ({ browser }, name, theme) => {
  const { page } = await actorFor(browser, name);

  await expect.poll(() => shownScheme(page), SHOW).toBe(schemeOf(theme));
});

Then(
  /^(?:a|o) (\p{L}+) não vê a página no tema claro, nem por um instante$/u,
  async ({ browser }, name) => {
    const { page } = await actorFor(browser, name);
    const firstBodyTheme = await page.evaluate(() => window.cairnFirstBodyTheme);

    expect(firstBodyTheme).toBe("dark");
  },
);

Then(/^(?:a|o) (\p{L}+) vê «([^»]+)» no rodapé$/u, async ({ browser }, name, label) => {
  const { page } = await actorFor(browser, name);

  await expect(legalLink(page, label)).toBeVisible(SHOW);
});

Then(/^(?:a|o) (\p{L}+) está na página «([^»]+)»$/u, async ({ browser }, name, title) => {
  const { page } = await actorFor(browser, name);

  await expect(page.getByRole("heading", { level: 1, name: title, exact: true })).toBeVisible(SHOW);
});
