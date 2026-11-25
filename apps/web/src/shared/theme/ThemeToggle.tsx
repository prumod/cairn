import { useEffect, useState } from "react";
import { chooseTheme, followSystemTheme, resolveTheme, type Theme } from "./theme.js";

const icons = {
  dark: (
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
  ),
  light: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />,
};

export function ThemeToggle() {
  // Unknown until mounted: the server cannot read the stored choice.
  const [theme, setTheme] = useState<Theme | undefined>(undefined);

  useEffect(() => {
    setTheme(resolveTheme());

    return followSystemTheme(setTheme);
  }, []);

  const dark = theme === "dark";

  return (
    <button
      type="button"
      className="grid size-8 cursor-pointer place-items-center rounded-md border border-line bg-transparent text-fg"
      aria-pressed={dark}
      aria-label="Modo escuro"
      title={dark ? "Ativar modo claro" : "Ativar modo escuro"}
      disabled={theme === undefined}
      onClick={() => {
        const next: Theme = dark ? "light" : "dark";

        chooseTheme(next);
        setTheme(next);
      }}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {dark ? icons.dark : icons.light}
      </svg>
    </button>
  );
}
