import { Link, Outlet } from "@tanstack/react-router";
import { ThemeToggle } from "./shared/theme/ThemeToggle.js";

export function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 flex min-h-12 items-center gap-3 border-b border-line bg-panel py-1 pr-2 pl-4">
        <Link className="text-md font-bold tracking-tight text-fg no-underline" to="/">
          Cairn
        </Link>
        <div className="flex-1" />
        <ThemeToggle />
      </header>
      <main className="mx-auto w-full max-w-[72rem] flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-line bg-panel px-4 py-3">
        <nav aria-label="Informação legal" className="flex flex-wrap gap-4 text-sm">
          <Link className="text-accent" to="/privacy">
            Política de privacidade
          </Link>
          <Link className="text-accent" to="/terms">
            Termos de utilização
          </Link>
        </nav>
      </footer>
    </div>
  );
}
