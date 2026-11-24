import { createTestApplication } from "../apps/web/tests/support/testSupport.js";

// playwright.config.ts names the disposable database once, so the steps can open the same one.
const databaseName = process.env.CAIRN_E2E_DATABASE;

if (!databaseName) throw new Error("Run the browser tests via playwright.config.ts.");

const application = await createTestApplication(4173, databaseName);
let closing: Promise<void> | undefined;

async function close() {
  closing ??= application.close().then(() => process.exit(0));
  await closing;
}

// Playwright signals the process group, and the wrapper also forwards the signal.
// Keep the idempotent handler installed until async teardown has finished.
process.on("SIGTERM", close);

process.on("SIGINT", close);
