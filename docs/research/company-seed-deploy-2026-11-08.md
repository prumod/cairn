# How a deploy runs the company seed after its migrations

**Research date:** 2026-11-08
**Ticket:** [#208](https://github.com/prumod/cairn/issues/208), child of map [#193](https://github.com/prumod/cairn/issues/193). Builds on the resolution of [#197](https://github.com/prumod/cairn/issues/197).
**Scope:** read only. No Neon database, Cloudflare resource or deploy was touched.

## Answer

Run the seed as an Alchemy `Command.Exec` resource in the stack. Give it the Neon project's pooled connection URI as a redacted environment variable, and set `memo: false` so it runs on every deploy. The Worker then depends on that resource, so Alchemy orders the steps this way: migrations (inside `Neon.Project`), then the seed, then the Worker. The database URL never leaves Alchemy. Local development and the automated tests call the same seed code with fixture values, through the same database URL their app client already uses. The GitHub `vars.*` reach the stack as step environment variables, and the stack reads them through Effect `Config`.

## Sources

The repository pins `alchemy` `2.0.0-beta.83` ([`packages/infra/package.json:20`](../../packages/infra/package.json)). The lockfile entry ([`bun.lock:967`](../../bun.lock)) has integrity `sha512-t0N4FwLU1JxLnKZGdsBNdqiycWDM5HEYmmIguMImplE07Vh+FPpMR8ypk3K3TY5Tg0sFFppXFVwtwiDp6xlX9w==`. The npm registry metadata for that version reports the same value. The package is not installed in this checkout. The source paths below are inside the published archive ([`alchemy-2.0.0-beta.83.tgz`](https://registry.npmjs.org/alchemy/-/alchemy-2.0.0-beta.83.tgz)), which was read during the research and not installed or run.

| Claim                                                                                                                                                                                     | Source in the archive                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `Neon.Project` runs the migrations (`runPgMigrations`, with the direct `connectionUri`), then `importFiles`, inside its own `reconcile`, before it returns its attributes                 | `src/Neon/Project.ts` lines 426–442                                                                     |
| `importFiles` are static `.sql` paths. `runImports` re-runs a file only when its hash changes                                                                                             | `src/Neon/Project.ts` lines 122–127 (doc) and 680–702 (`runImports`)                                    |
| `Command.Exec` runs a command for its side effects and fails the deploy on a non-zero exit. Its doc names «seeding data» and «running migrations» as uses                                 | `src/Command/Exec.ts` lines 34–44 and 86                                                                |
| `memo: false` makes `Exec` re-run on every deploy. The diff always updates, and the stored input hash is `undefined`                                                                      | `src/Command/Exec.ts` lines 9–19, 100 and 117–119                                                       |
| `Exec` exposes only `hash` as its output                                                                                                                                                  | `src/Command/Exec.ts` lines 21–31                                                                       |
| The command runs without a shell (`shell` defaults to `false`). The string is split on whitespace. The child inherits `process.env` (`extendEnv: true`)                                   | `src/Command/Command.ts` lines 243–260, 273 and 282                                                     |
| `env` accepts `string \| Redacted<string>` values, on top of `process.env`                                                                                                                | `src/Command/Command.ts` lines 48–54                                                                    |
| Redacted `env` values are masked in the error message and the logged output                                                                                                               | `src/Command/Command.ts` lines 151–154 and 328; `src/Command/Redaction.ts` line 17                      |
| Every resource prop accepts an `Output`, so `env.DATABASE_URL` can be `project.pooledConnectionUri`                                                                                       | `src/Input.ts` lines 11–29; `src/Resource.ts` line 334                                                  |
| Dependency edges come from the `Output`s that props reference                                                                                                                             | `src/Plan.ts` lines 387–395 (`Output.upstreamAny`)                                                      |
| `Neon.providers()` already includes `Command.providers()` (line 122, inside `providers` at line 70). The Cloudflare provider set includes it too (line 662), so no new provider is needed | `src/Neon/Providers.ts` lines 70 and 122; `src/Cloudflare/Providers.ts` line 662                        |
| `Output.map` and `Output.all` combine outputs                                                                                                                                             | `src/Output.ts` lines 222 and 337                                                                       |
| `Action` is an in-process Effect that runs after its upstreams, and is skipped when the hash of its resolved input is unchanged                                                           | `src/Action.ts` lines 13–28; `src/Plan.ts` lines 1215–1250; `src/Apply.ts` lines 1395–1446              |
| An `Action`'s captured outputs wait for their upstreams but are not part of the hashed input                                                                                              | `src/Apply.ts` lines 1405–1411 and 1415–1416; `src/State/ActionState.ts`; `src/ActionRuntimeContext.ts` |

Repository facts:

- The stack applies `../db/migrations` in `Neon.Project`, and gives the Worker `pooledConnectionUri` as `DATABASE_URL` ([`packages/infra/alchemy.run.ts:23-37`](../../packages/infra/alchemy.run.ts): line 26 for dev, line 36 for the pooled URI, line 71 for the Worker env). Local `dev` reads `DATABASE_URL` from the environment instead. Only cloud stages are `managed` ([`ARCHITECTURE.md:26`](../../ARCHITECTURE.md)).
- Both deploy workflows pass configuration as step `env`, then poll `/healthz` for `status == "ready"` and the deployed revision: [`.github/workflows/deploy.yml:38-67`](../../.github/workflows/deploy.yml) and [`.github/workflows/deploy-production.yml:32-62`](../../.github/workflows/deploy-production.yml).
- Local migrations run through `bun run dev:db` ([`package.json:26`](../../package.json)). It passes the direct PostgreSQL URL (`127.0.0.1:54320`) to `db:migrate`, because `db:migrate` cannot use the Neon HTTP proxy URL that `.env.local` holds ([`docs/how-to/run-company-profile.md:40`](../how-to/run-company-profile.md)).
- The app's database client is Neon HTTP: `neon(env.DATABASE_URL)` in [`packages/db/src/index.ts:20`](../../packages/db/src/index.ts). The same doc says a plain PostgreSQL URL is not a substitute (`run-company-profile.md:42`).
- The automated tests create one database per test, and migrate it with `drizzle-orm/neon-http/migrator` through the Neon HTTP proxy URL ([`apps/web/tests/support/testSupport.ts:182-199`](../../apps/web/tests/support/testSupport.ts)).
- The setup wizard runs `dev:db` ([`scripts/setup-project.sh:367`](../../scripts/setup-project.sh)).
- [`packages/infra/.env.schema`](../../packages/infra/.env.schema) declares the stack's variables for Varlock. It has no `COMPANY_*` entries yet.
- Two docs say there is no seed, and must change when it lands: [`ARCHITECTURE.md:26`](../../ARCHITECTURE.md) («There is no seed step») and [`run-company-profile.md:44`](../how-to/run-company-profile.md) («There is no seed command»).

## To settle

### 1. Where the seed runs

**Recommendation: a `Command.Exec` resource in the Alchemy stack**, created in the managed branch next to `Neon.Project`:

- `command`: one package script owned by the `company` module in `apps/web`, for example `bun run seed:company`, with `cwd` set to `apps/web`. The command is split on whitespace, so the script must not need quoted arguments.
- `env.DATABASE_URL`: `Output.map(project.pooledConnectionUri, Redacted.make)`. This is the URL the Worker already receives (`alchemy.run.ts:36`, `:71`), and it is the kind of URL the app's Neon HTTP client uses (`packages/db/src/index.ts:20`). The migrations use the direct `connectionUri` because they run through `runPgMigrations`. The seed is application code, so it uses the app's client. The URL stays in Alchemy.
- `env.COMPANY_*`: the five configuration values (section 4).
- `memo: false`: the seed runs on every deploy. The seed is idempotent (#197: insert only when no company exists, then backfill `user_access.company_id`), so a re-run is safe. A re-run also restores the company if its row is gone.

Options compared:

| Option                                  | Verdict            | Reason                                                                                                                                                                                                   |
| --------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Command.Exec` in the stack             | **Recommended**    | The URL stays in Alchemy. Alchemy orders it by the dependency graph. One seed script serves the deploy, local development and tests. No new provider                                                     |
| `Action` in the stack                   | Viable, not chosen | In-process and typed. But the stack would import application code from `apps/web`, and the run is skipped when its input hash is unchanged. To run it on every deploy, its input would need the revision |
| `Neon.Project` `importFiles`            | Rejected           | Static SQL files cannot read the deployment configuration. This is the same reason #197 rejected a seed inside the migration. They re-run only when a file's hash changes                                |
| A workflow step after the deploy        | Rejected           | The URL would have to leave Alchemy, and the Worker would already serve requests before the seed ran                                                                                                     |
| A custom resource with its own provider | Rejected           | `Command.Exec` already does this. A provider adds a lifecycle (diff, delete) that a seed does not need                                                                                                   |

### 2. Ordering

The order is migrations, then the seed, then the Worker:

1. **Migrations before the seed.** `Exec` references `project.pooledConnectionUri`, so Alchemy plans it after `Neon.Project`. `Neon.Project` finishes its `reconcile`, including the migrations, before it publishes its attributes (`src/Neon/Project.ts:426-442`). The seed therefore sees the migrated schema. This also covers release A of #197: the migration that adds `user_access.company_id` runs before the seed backfills it.
2. **Seed before the Worker.** Make the Worker's `DATABASE_URL` reference the seed resource too, for example `Output.map(Output.all(project.pooledConnectionUri, seed.hash), ([uri]) => Redacted.make(uri))`. With `memo: false`, `seed.hash.input` is always `undefined` (`Exec.ts:117-119`). So only the URL is used as a value, and the seed output is listed only to create the dependency edge. A new Worker version then deploys only after the seed succeeds. If the seed fails, the deploy fails and the previous Worker version keeps serving.
3. **Safety net.** `/healthz` reports not ready without a company (#197). The workflows' revision check then fails if the seed did not run.

**Unverified:** that listing `seed.hash` in an `Output.all` creates the edge, as `Plan.ts:387-395` suggests. The implementer must confirm it with an `alchemy plan` that shows the Worker after the seed. If it does not, the options are to make the seed an `Action` (section 1 table), or to research how Exec outputs can carry a value, since `Exec` exposes only `hash`.

### 3. Local development and the automated tests

There is one seed function, owned by the `company` module, with two callers besides the deploy. Both must pass the URL that the app's client already uses (Neon HTTP). They must not pass the direct PostgreSQL URL.

- **Local `dev` stage.** Alchemy does not seed. The stage is not `managed` (`ARCHITECTURE.md:26`), there is no `Neon.Project`, and `.env.local` holds the Neon HTTP proxy URL. Instead, `dev:db` (`package.json:26`) should run the seed script after `db:migrate`, with the proxy URL from `.env.local` and fixed fixture values. For example: name «Cairn local», label «Leiria», and approximate Leiria coordinates. Today `dev:db` passes the direct URL to `db:migrate`, so the seed step needs the proxy URL instead. The setup wizard runs `dev:db` (`scripts/setup-project.sh:367`), so a new machine gets a company too.
- **Automated tests (the test-only `CairnAcceptance` stack).** That stack ([`packages/infra/test/alchemy.run.ts`](../../packages/infra/test/alchemy.run.ts)) has no `Neon.Project`. It reads `DATABASE_URL` from the environment (line 36) and only starts the Worker. So `testSupport.ts` should call the seed right after `migrate` on each isolated database (`testSupport.ts:195-199`). It should use the same `neonURL` it already passes to `createDb` (line 194), with fixture values, before the Worker starts. A test that needs other company values sets them through the profile use case or a fixture override. It does not change the seed.
- **The cloud `testing` stage** is not a fixture stage. It seeds from its own GitHub environment variables, as production does.

### 4. How the `vars.*` reach the seed

1. In each GitHub environment (`testing`, `production`), create `COMPANY_NAME`, `COMPANY_MORADA`, `COMPANY_LOCATION_LABEL`, `COMPANY_LATITUDE` and `COMPANY_LONGITUDE` as **variables**, not secrets (#197).
2. In both workflows, add `COMPANY_NAME: ${{ vars.COMPANY_NAME }}` and so on to the «Deploy …» step's `env`, beside `BOOTSTRAP_ADMIN_EMAIL`.
3. `packages/infra/.env.schema` declares the five as `@public @required=false`, as it declares `POSTHOG_PROJECT_TOKEN` today.
4. `alchemy.run.ts` reads them in the managed branch with `Config.NonEmptyString`. It reads the coordinates with `Config.Number` and converts them to strings, because `env` takes only strings (`Command.ts:54`). A missing variable should fail the deploy when the stack is evaluated, as `GOOGLE_CLIENT_ID` does today (`alchemy.run.ts:75`). Whether that happens before any resource changes is unverified.

The Worker does not need these values. It reads the company from the database (#197).

## Decision boundary

- **Read:** the Alchemy 2.0.0-beta.83 source (archive read during the research), the repository files cited above, and the #197 and #208 bodies. **Not run:** any `alchemy plan` or deploy, any database query, and any Neon or Cloudflare call.
- **Unverified:**
  - the Worker-after-seed edge (section 2);
  - how Alchemy serialises a `Redacted` `env` value into state. This adds no new exposure, because `Neon.Project` already keeps `connectionUri` in its state attributes (`src/Neon/Project.ts:149-152`);
  - whether the seed's app client accepts the pooled URI in the same way the Worker does. The Worker already receives this URI, so the risk is low;
  - the `dev:db` and test-harness changes, which have not been run.
- **Follow-up docs:** when the seed lands, update `ARCHITECTURE.md:26`, [`run-company-profile.md:44`](../how-to/run-company-profile.md) and [`docs/agents/checks.md:39`](../agents/checks.md), which describes `dev:db`. Follow [`docs/agents/documentation.md`](../agents/documentation.md): when a system boundary changes, delegate the documentation update.
- **Not decided here:** the seed script's location and name inside `apps/web`. The implementer follows [`docs/reference/project-structure.md`](../reference/project-structure.md).
