import { Link, Outlet } from "@tanstack/react-router";

export function AppLayout() {
  return (
    <>
      <header>
        <Link className="brand" to="/">
          Cairn
        </Link>
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
