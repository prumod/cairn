import pg from "pg";

// Playwright's worker reads the same disposable database the test application migrated.
// The wrapper supplies TEST_DATABASE_URL; playwright.config.ts names the database.
function databaseUrl() {
  const server = process.env.TEST_DATABASE_URL;
  const name = process.env.CAIRN_E2E_DATABASE;

  if (!server || !name) throw new Error("Run the browser tests via the PostgreSQL test wrapper.");

  const url = new URL(server);
  url.pathname = "/" + name;

  return url.toString();
}

let pool: pg.Pool | undefined;

export function database() {
  pool ??= new pg.Pool({ connectionString: databaseUrl() });

  return pool;
}

export async function closeDatabase() {
  await pool?.end();
  pool = undefined;
}

// Same tables the application's reset truncates (apps/web/tests/support/testSupport.ts).
export async function resetDatabase() {
  await database().query(
    'TRUNCATE TABLE company_alvara, company, session, account, verification, user_access, "user" RESTART IDENTITY CASCADE',
  );
  // The installation's company must exist before anyone signs in (GetMyAccess reads it).
  await database().query(
    `INSERT INTO company (id, name, morada, location_label, latitude, longitude, radius_km)
     VALUES (gen_random_uuid(), 'Cairn de teste', 'Rua de teste, 1', 'Leiria', 39.7436, -8.8071, 50)`,
  );
}
