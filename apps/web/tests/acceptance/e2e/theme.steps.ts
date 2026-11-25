import { expect, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const SHOW = { timeout: 30_000 };
// Must match STORAGE_KEY in src/shared/theme/theme.ts.

const STORAGE_KEY = "cairn-theme";
const FIRST_THEME_KEY = "cairn-test-first-theme";

const { Given, When, Then } = createBdd();

const themeByLabel = { claro: "light", escuro: "dark" } as const;

type Label = keyof typeof themeByLabel;

// Stores the choice before any page script runs, as if it had been made on an earlier visit.
async function storeChoice(page: Page, theme: string) {
  await page.addInitScript(
    ([key, value]) => {
      localStorage.setItem(key, value);
    },
    [STORAGE_KEY, theme] as const,
  );
}

// Records the first data-theme value the document gets, and whether the parser was still
// reading the document at that moment, which means before the first paint.
async function recordFirstTheme(page: Page) {
  await page.addInitScript((key) => {
    const root = document.documentElement;

    const record = () => {
      if (root.dataset.theme && !sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, root.dataset.theme + "|" + document.readyState);
      }
    };

    new MutationObserver(record).observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    record();
  }, FIRST_THEME_KEY);
}

Given(/^que o sistema prefere o tema (claro|escuro)$/, async ({ page }, label: Label) => {
  await page.emulateMedia({ colorScheme: themeByLabel[label] });
});

Given(/^que o tema (claro|escuro) foi escolhido$/, async ({ page }, label: Label) => {
  await storeChoice(page, themeByLabel[label]);
  await recordFirstTheme(page);
});

When(/^se abre a aplicação(?: sem escolha de tema)?$/, async ({ page }) => {
  await page.goto("/");
});

When(/^se ativa o tema (claro|escuro)$/, async ({ page }, label: Label) => {
  const toggle = page.getByRole("button", { name: "Modo escuro" });

  await expect(toggle).toBeEnabled(SHOW);

  if ((await toggle.getAttribute("aria-pressed")) !== String(label === "escuro")) {
    await toggle.click();
  }
});

When("se recarrega a página", async ({ page }) => {
  await page.reload();
});

Then(/^o tema da página é (claro|escuro)$/, async ({ page }, label: Label) => {
  await expect(page.locator("html")).toHaveAttribute("data-theme", themeByLabel[label], SHOW);
});

Then(
  /^o tema (claro|escuro) estava definido antes do primeiro desenho da página$/,
  async ({ page }, label: Label) => {
    await expect(page.locator("html")).toHaveAttribute("data-theme", themeByLabel[label], SHOW);
    const first = await page.evaluate((key) => sessionStorage.getItem(key), FIRST_THEME_KEY);

    expect(first).toBe(themeByLabel[label] + "|loading");
  },
);
