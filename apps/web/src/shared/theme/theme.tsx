import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

// The visitor's stored choice. An absent value means the system preference applies.
export const themeStorageKey = "cairn-theme";

const darkQuery = "(prefers-color-scheme: dark)";

export function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(themeStorageKey);

    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    // Storage can be blocked; the system preference then applies.
    return null;
  }
}

export function storeTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Storage can be blocked; the choice then lasts only for this page.
  }
}

// null removes data-theme, so the stylesheet follows the system preference.
export function applyTheme(theme: Theme | null): void {
  if (theme) document.documentElement.dataset.theme = theme;
  else delete document.documentElement.dataset.theme;
}

export function currentTheme(): Theme {
  const applied = document.documentElement.dataset.theme;

  if (applied === "light" || applied === "dark") return applied;

  return window.matchMedia(darkQuery).matches ? "dark" : "light";
}

// Runs inline in <head>, before first paint. It is built from themeStorageKey so the key is defined once.
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(themeStorageKey)});if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}})();`;

export function ThemeToggle() {
  // The first render, on the server and in the browser, shows the light state; the effect then reads the real one.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(currentTheme());

    const query = window.matchMedia(darkQuery);

    const followSystem = () => {
      if (readStoredTheme() === null) setTheme(query.matches ? "dark" : "light");
    };

    query.addEventListener("change", followSystem);

    return () => query.removeEventListener("change", followSystem);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";

    storeTheme(next);
    applyTheme(next);
    setTheme(next);
  }

  const dark = theme === "dark";

  return (
    <button
      type="button"
      className="inline-flex size-9 items-center justify-center rounded-md border border-line bg-panel p-0 text-fg hover:bg-panel2 hover:filter-none"
      aria-pressed={dark}
      aria-label="Modo escuro"
      title={dark ? "Ativar modo claro" : "Ativar modo escuro"}
      onClick={toggle}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      className="size-4.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="size-4.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
    </svg>
  );
}
