export type Theme = "light" | "dark";

const STORAGE_KEY = "cairn-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

function storedTheme(): Theme | undefined {
  try {
    const value = localStorage.getItem(STORAGE_KEY);

    return isTheme(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

function systemTheme(): Theme {
  return matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

// The theme in effect: the stored choice, else the system preference.
export function resolveTheme(): Theme {
  return storedTheme() ?? systemTheme();
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

// Stores the choice so later page loads, and the head script, apply it.
export function chooseTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage is blocked: the choice lasts until the page closes.
  }

  applyTheme(theme);
}

// Calls `listener` when the system preference changes and the person has made no choice.
export function followSystemTheme(listener: (theme: Theme) => void): () => void {
  const query = matchMedia(DARK_QUERY);

  const onChange = () => {
    if (storedTheme() === undefined) {
      const theme = systemTheme();

      applyTheme(theme);
      listener(theme);
    }
  };

  query.addEventListener("change", onChange);

  return () => query.removeEventListener("change", onChange);
}

// Runs in <head> before first paint, so the page never shows the wrong theme. It must
// stay self-contained: it is serialised into the document and cannot import anything.
function applyStoredThemeBeforePaint(key: string, darkQuery: string): void {
  let theme: string | null = null;

  try {
    theme = localStorage.getItem(key);
  } catch {
    // Storage is blocked: fall back to the system preference.
  }

  document.documentElement.dataset.theme =
    theme === "light" || theme === "dark"
      ? theme
      : matchMedia(darkQuery).matches
        ? "dark"
        : "light";
}

export const noFlashScript = `(${applyStoredThemeBeforePaint.toString()})(${JSON.stringify(STORAGE_KEY)},${JSON.stringify(DARK_QUERY)})`;
