import { expect, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { createBdd, type DataTable } from "playwright-bdd";
import {
  addSessionCookies,
  signInWithFakeGoogle,
  testAuthSettings,
  type FakeGoogleIdentity,
} from "../../support/testAuth.js";
import { database, resetDatabase } from "./support/database.js";

// Must match baseURL in playwright.config.ts.
const ORIGIN = "http://127.0.0.1:4173";
const SHOW = { timeout: 30_000 };

const { Before, After, Given, When, Then } = createBdd();

type Actor = { context: BrowserContext; page: Page };

// Per-scenario world. Cleared by the Before and After hooks below.
const identities = new Map<string, FakeGoogleIdentity>();
const actors = new Map<string, Actor>();
let administratorName: string | undefined;

const statusByLabel = { aprovado: "approved", pendente: "pending", revogado: "revoked" } as const;

function slug(name: string) {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function userIdOf(name: string) {
  return "user-" + slug(name);
}

function identityOf(name: string) {
  const identity = identities.get(name);

  if (!identity) throw new Error(name + " has no Google identity in this scenario.");

  return identity;
}

// Declares a person who has never signed in. Their user row is created by the sign-in itself.
function declareIdentity(name: string, email: string, emailVerified: boolean) {
  identities.set(name, { sub: "google-" + slug(name), email, emailVerified, name });
}

// Creates a person who has signed in before: user, linked Google account, and access row.
async function insertPerson(
  name: string,
  email: string,
  emailVerified: boolean,
  status: (typeof statusByLabel)[keyof typeof statusByLabel],
) {
  declareIdentity(name, email, emailVerified);
  const identity = identityOf(name);
  const userId = userIdOf(name);

  await database().query(
    'INSERT INTO "user" (id, name, email, "emailVerified") VALUES ($1, $2, $3, $4)',
    [userId, name, email, emailVerified],
  );
  await database().query(
    'INSERT INTO account (id, "accountId", "providerId", "userId") VALUES ($1, $2, \'google\', $3)',
    ["account-" + slug(name), identity.sub, userId],
  );
  await database().query(
    `INSERT INTO user_access (user_id, administrator, approved, status, company_id)
     VALUES ($1, false, $2, $3, (SELECT id FROM company LIMIT 1))`,
    [userId, status === "approved", status],
  );
}

async function actorFor(browser: Browser, name: string) {
  const existing = actors.get(name);

  if (existing) return existing;

  const context = await browser.newContext({ baseURL: ORIGIN });
  const actor = { context, page: await context.newPage() };

  actors.set(name, actor);

  return actor;
}

// Signs the person in through the public sign-in route, then gives their browser the session.
async function signIn(
  browser: Browser,
  request: Parameters<typeof signInWithFakeGoogle>[0],
  name: string,
) {
  const cookies = await signInWithFakeGoogle(request, ORIGIN, identityOf(name));
  const actor = await actorFor(browser, name);

  await addSessionCookies(actor.context, ORIGIN, cookies);

  return actor;
}

function administratorPage(): Page {
  if (!administratorName) throw new Error("The scenario has no administrator.");

  const actor = actors.get(administratorName);

  if (!actor) throw new Error(administratorName + " has no browser session.");

  return actor.page;
}

function rowFor(page: Page, name: string) {
  return page.getByRole("row").filter({ has: page.getByRole("cell", { name, exact: true }) });
}

async function expectVisible(page: Page, text: string) {
  await expect(page.getByText(text, { exact: true }).first()).toBeVisible(SHOW);
}

async function expectHidden(page: Page, text: string) {
  await expect(page.getByText(text, { exact: true })).toHaveCount(0);
}

Before(async () => {
  identities.clear();
  administratorName = undefined;
  await resetDatabase();
});

After(async () => {
  for (const actor of actors.values()) await actor.context.close();

  actors.clear();
});

// Context

Given(/^que o e-mail do administrador da instalação é "([^"]+)"$/, async ({}, email) => {
  if (email !== testAuthSettings.bootstrapAdministratorEmail)
    throw new Error("The test installation's administrator is not " + email + ".");
});

// Preconditions

Given(/^que existem os utilizadores:$/, async ({}, table: DataTable) => {
  for (const row of table.hashes()) {
    const verified = row["e-mail verificado"] === "sim";
    // SAFETY: an unknown label is caught by the check below, so only a known key reaches the lookup.
    const status = statusByLabel[row["acesso"] as keyof typeof statusByLabel];

    if (!status) throw new Error("Unknown access state: " + row["acesso"]);

    await insertPerson(row["nome"]!, row["e-mail"]!, verified, status);
  }
});

Given(/^o administrador é a Helena$/, async () => {
  administratorName = "Helena";

  await database().query("UPDATE user_access SET administrator = true WHERE user_id = $1", [
    userIdOf("Helena"),
  ]);
});

Given(
  /^(?:que )?(?:a|o) (\p{L}+) tem o e-mail (verificado|não verificado) "([^"]+)" e nunca entrou$/u,
  async ({}, name, verification, email) => {
    declareIdentity(name, email, verification === "verificado");
  },
);

Given(
  /^(?:que )?(?:a|o) (\p{L}+) tem o e-mail (verificado|não verificado) "([^"]+)" e o acesso (pendente|aprovado|revogado)$/u,
  async ({}, name, verification, email, status) => {
    // SAFETY: the step's regular expression accepts only the three keys of statusByLabel.
    await insertPerson(
      name,
      email,
      verification === "verificado",
      statusByLabel[status as keyof typeof statusByLabel],
    );
  },
);

Given(/^(?:a|o) (\p{L}+) tem sessão iniciada$/u, async ({ browser, request }, name) => {
  const actor = await signIn(browser, request, name);

  await actor.page.goto("/");
  await expectVisible(actor.page, "Sair");
});

Given(
  /^(?:a|o) (\p{L}+) tem uma sessão aberta de antes de o seu acesso ser revogado$/u,
  async ({ browser, request }, name) => {
    await signIn(browser, request, name);
  },
);

// Actions

When(/^(?:a|o) (\p{L}+) entra$/u, async ({ browser, request }, name) => {
  const actor = await signIn(browser, request, name);

  await actor.page.goto("/");
});

When(/^(?:a|o) (\p{L}+) abre a aplicação$/u, async ({ browser }, name) => {
  const actor = await actorFor(browser, name);

  await actor.page.goto("/");
});

When(/^(?:a|o) (\p{L}+) sai$/u, async ({ browser }, name) => {
  const actor = await actorFor(browser, name);

  await actor.page.goto("/");
  await actor.page.getByRole("button", { name: "Sair", exact: true }).click();
});

When(/^a (\p{L}+) aprova (?:a|o) (\p{L}+)$/u, async ({}, _administrator, target) => {
  const page = administratorPage();

  await expect(page.getByRole("heading", { name: "Gerir acessos" })).toBeVisible(SHOW);
  await rowFor(page, target).getByRole("button", { name: "Aprovar", exact: true }).click();
});

When(/^a (\p{L}+) revoga (?:a|o) (\p{L}+)$/u, async ({}, _administrator, target) => {
  const page = administratorPage();

  await expect(page.getByRole("heading", { name: "Gerir acessos" })).toBeVisible(SHOW);
  await rowFor(page, target).getByRole("button", { name: "Revogar", exact: true }).click();
});

// Observations

Then(
  /^o acesso d[ao] (\p{L}+) aparece como «([^»]+)» em «([^»]+)»$/u,
  async ({}, name, label, heading) => {
    const page = administratorPage();

    await expect(page.getByRole("heading", { name: heading })).toBeVisible(SHOW);
    await expect(rowFor(page, name).getByRole("cell", { name: label, exact: true })).toBeVisible(
      SHOW,
    );
  },
);

// The person's own page when they have one (the bootstrap administrator signs in as themself).
Then(/^o acesso d[ao] (\p{L}+) é «([^»]+)»$/u, async ({}, name, label) => {
  const page = actors.get(name)?.page ?? administratorPage();

  await expect(rowFor(page, name).getByRole("cell", { name: label, exact: true })).toBeVisible(
    SHOW,
  );
});

Then(/^(?:a|o) (\p{L}+) vê «([^»]+)»$/u, async ({ browser }, name, text) => {
  await expectVisible((await actorFor(browser, name)).page, text);
});

Then(/^(?:a|o) (\p{L}+) não vê «([^»]+)»$/u, async ({ browser }, name, text) => {
  await expectHidden((await actorFor(browser, name)).page, text);
});
