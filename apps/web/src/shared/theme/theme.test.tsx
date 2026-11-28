import { afterEach, describe, expect, it, vi } from "vitest";
import { readStoredTheme, themeInitScript, themeStorageKey } from "./theme.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubStoredValue(stored: string | null) {
  vi.stubGlobal("window", { localStorage: { getItem: () => stored } });
}

// Runs the inline head script against stub objects, as the browser runs it before the first paint.
function runInitScript(stored: string | null) {
  const requestedKeys: string[] = [];

  const localStorage = {
    getItem(key: string) {
      requestedKeys.push(key);

      return stored;
    },
  };

  const dataset: Record<string, string> = {};

  new Function("localStorage", "document", themeInitScript)(localStorage, {
    documentElement: { dataset },
  });

  return { dataset, requestedKeys };
}

describe("the stored theme", () => {
  it("is the saved choice when the stored value is light or dark", () => {
    stubStoredValue("dark");

    expect(readStoredTheme()).toBe("dark");
  });

  it("means the system preference when the stored value is neither light nor dark", () => {
    stubStoredValue("auto");

    expect(readStoredTheme()).toBeNull();
  });

  it("means the system preference when no choice is saved", () => {
    stubStoredValue(null);

    expect(readStoredTheme()).toBeNull();
  });

  it("means the system preference when storage is blocked", () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem() {
          throw new Error("Storage is blocked.");
        },
      },
    });

    expect(readStoredTheme()).toBeNull();
  });
});

describe("the inline head script", () => {
  it("sets data-theme from a saved choice", () => {
    expect(runInitScript("dark").dataset.theme).toBe("dark");
  });

  it("leaves data-theme unset when no choice is saved", () => {
    expect(runInitScript(null).dataset.theme).toBeUndefined();
  });

  it("leaves data-theme unset when the stored value is neither light nor dark", () => {
    expect(runInitScript("auto").dataset.theme).toBeUndefined();
  });

  it("reads the same storage key as the rest of the module", () => {
    expect(runInitScript(null).requestedKeys).toEqual([themeStorageKey]);
  });
});
