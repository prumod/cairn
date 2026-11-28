import { Link, Outlet } from "@tanstack/react-router";
import { ThemeToggle } from "./shared/theme/theme.js";

export function AppLayout() {
  return (
    <>
      <header>
        <Link className="text-2xl font-bold no-underline" to="/">
          Cairn
        </Link>
        <ThemeToggle />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <nav aria-label="Informação legal">
          <Link to="/privacy">Política de privacidade</Link>
          <Link to="/terms">Termos de utilização</Link>
        </nav>
      </footer>
    </>
  );
}
