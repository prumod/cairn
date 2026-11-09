# Project structure

This reference defines the required feature-driven structure and separately records the current workspace and enforced dependency boundaries. Do not create empty directories just to match an example.

## Apps, packages and infra

Base: [Where do the collector and the code it shares with the web app live?](https://github.com/prumod/cairn/issues/194).

- An **app** is a unit of deployment. Code deployed to a different environment (the Cloudflare Worker or a GitHub Actions job) goes in its own app. One app may hold several runtimes when its framework compiles them together, as TanStack Start does for the browser and the Worker.
- A **package** is a unit of packaging. Its runtime, dependencies and compile settings must be compatible with every destination that uses it: each app and each runtime inside that app. Code whose destinations differ goes in its own package. A shared package holds only code that more than one app uses; everything else stays in the app that uses it.
- **Infra** is code that talks to something outside our apps, on either side: a database, the browser, the Diário da República feed or a model provider. The frontend can have infra too.

Planned layout, not yet built: an `apps/collector` app for the collector; `packages/shared` for isomorphic code that both apps use (the CAOP place catalogue and the annex I categorias), replacing the reserved root `shared/src`; and the tables that both apps use in `packages/db`: auth, `entidade_adjudicante` (with its `entidade_designacao` aliases), `concurso`, `anuncio`, `lote`, `recolha` and `recolha_item` ([What are the tables, columns and keys of the Now database?](https://github.com/prumod/cairn/issues/233#issuecomment-6726944738)). App-only tables stay in their app. The collector-only tables, `feed_cursor` and `cpv_table_state`, live in `apps/collector/src/modules/recolha/infra/*Table.ts`. The boundary rules and `drizzle.config.ts` change with that implementation.

Planned migration ownership, not yet built ([What are the tables, columns and keys of the Now database?](https://github.com/prumod/cairn/issues/233#issuecomment-6726944738)):

- `packages/db/migrations/` holds the only migration history. `drizzle-kit generate` writes it from every table file that the `schema` globs in `packages/db/drizzle.config.ts` list. Today these are `packages/db/src/schema/auth.ts` and `apps/web/src/server/modules/*/persistence/*Table.ts`; the plan adds `packages/db/src/schema/*.ts`, `apps/collector/src/modules/*/infra/*Table.ts` and `apps/web/src/pages/*/infra/*Table.ts` (the discovery and assistant features' own tables). A new table location adds its glob in the same pull request.
- A table belongs to the one module that writes it. Other modules only read it. An app table may reference a `packages/db` table. A `packages/db` table never references an app table. Collector tables never reference web tables.
- Only the deploy (the `migrations` option of the Alchemy `Neon.Project` in `packages/infra/alchemy.run.ts`) , the test fixtures and the local development database (`bun run dev:db`) apply migrations. The collector never migrates. At start, it checks that the database has applied every migration in its checkout. Otherwise it writes nothing and logs `collection_failed` with reason `schemaBehind`.
- A merged migration is never edited. A change that removes or narrows anything (a drop, a rename, `NOT NULL` on existing rows, a tighter CHECK) is expand-then-contract over two releases.

Also planned: `apps/web/evals/assistant/` for the assistant's evaluation (reference requests, fixed world, Verifier, runner and committed reports). It belongs to `apps/web` because it composes that app's action catalogue and guard, and it sits outside `tests/` because `test:fast` never calls a model. Base: [How do the assistant's reference-request evaluations run?](https://github.com/prumod/cairn/issues/234#issuecomment-6726904291).

Also planned for Now, with the first slice that needs each (base: [What is the program design inside each Now module?](https://github.com/prumod/cairn/issues/235#issuecomment-6726996956)):

- **Modules.** `apps/collector/src/modules/recolha/` (the `Concurso` entity, the parser, `CollectAnunciosUseCase`); `apps/web/src/server/modules/company/` (the `Company` domain in its root `company.ts`, the repository and seed in `company.server.ts`); `apps/web/src/pages/discovery/` (the view, `ListLotesUseCase`, `RadiusFilter`, `ChangeViewUseCase` for the view actions and the manual categoria); `apps/web/src/pages/assistant/` (comments, citations, the assistant loop and its model input); `apps/web/src/shared/actions/`, an isomorphic module for the action catalogue, `Step` and `DataChange`; `apps/web/src/shared/theme/`.
- **Composition.** One composition file per app: `apps/web/src/server/composition.server.ts`, built per request (it replaces `getRuntime`), and `apps/collector/src/composition.ts`, built once at start.
- **Imports between modules.** A use case or domain file may import another feature's or server module's public, framework-free root file (for example `pages/discovery/discovery.ts` or `server/modules/company/company.ts`) and `src/shared/actions`. It still never imports another module's `infra/`, `.server.ts` or `.functions.ts` files. Inside a feature, a use case may also import the plain `useCases/*.ts` root helpers (such as the assistant's `assistantLoop.ts`) and another use case of the same feature, which it receives through its constructor (`ChangeViewUseCase` receives `ListLotesUseCase` and `GetConcursoUseCase`). The current rules do not allow this yet. The first slice that needs it changes `.dependency-cruiser.cjs` and `scripts/prove-boundaries.mjs` as follows:
  - **New role, use-case helper:** plain `.ts` files directly under `pages/<feature>/useCases/`, not `*.server.ts`, `*.functions.ts` or tests. Today the `pureUseCase` pattern matches only `useCases/<name>/*.ts`, so these files are unchecked. A helper gets the same bans as a use case: no `infra/`, `.server.ts` or `.functions.ts` import, type-only imports included.
  - **A use case or helper may import** its feature's use-case helpers, and another use-case folder of the same feature with `import type` only (dependency-cruiser `dependencyTypesNot: ["type-only"]` on the rejection). A value import stays rejected, so the composition file stays the one place that builds objects.
  - **Still rejected:** a use case or helper importing another feature's use case or helper (only the root file is public).
  - **Proofs:** flip the `feature-usecase-is-independent` proof (a use case importing another use case) to «value import rejected, type-only import allowed»; add allowed proofs for use case → helper; add rejection proofs for use case → another feature's use case, helper → `infra/`, and helper → `context.server.ts`.
  - **Scan:** add `apps/web/evals` to the paths in `scripts/check-boundaries.mjs`, so the evaluation reaches the assistant only through its root file.
- **Request context.** Every server function, backoffice's included, builds its context through one helper, `approvedContext({ write })` in `apps/web/src/server/shared/requestContext/requestContext.server.ts`. For a write, it checks the origin first, then the session (401), then approval (403); then it reads the company and sets `no-store`. It replaces backoffice's `useCases/context.server.ts` (base: «Server functions, sign-in and access» in [the Now technical design](technical-design-now-discovery.md)).
- **Marks.** Discovery does not import the assistant feature. The Now layout reads the comment marks through the assistant's root `marks.functions.ts` and passes them to the discovery components as props.

## Required feature-driven structure

Organize application code by the feature that owns its behavior. A page feature owns its components, use cases, and colocated tests. A feature that needs server-backed behavior splits that code into three folders by role:

- `domain/` holds domain rules that several use cases share, such as actors, errors, and authorization rules. It imports no framework, database, or adapter code. Add a file here only when more than one use case needs the same rule.
- `infra/` holds the feature's infra: code that talks to something outside our apps, such as the implementations of persistence interfaces that the application defines. Server-only infra, such as a database repository, uses the `.server.ts` suffix.
- `useCases/` holds one folder per use case, containing its application logic and client-callable adapter. A use case's tests live in its folder. Helpers that several use cases share, such as `context.server.ts`, and their tests stay at the `useCases/` root.

For example:

```text
src/
  pages/
    backoffice/
      backoffice.page.tsx
      components/
        accessManager.tsx
        accessManager.test.tsx
      domain/
        access.ts
      infra/
        users.server.ts
      useCases/
        context.server.ts
        failureResponse.server.ts
        failureResponse.server.test.ts
        changeAccess/
          changeAccess.ts
          changeAccess.test.ts
          changeAccess.functions.ts
        listUsers/
          listUsers.ts
          listUsers.test.ts
          listUsers.functions.ts
  shared/
    components/
      layout/
        layout.tsx
    notifications/
      notificationService.tsx
```

`domain/access.ts` holds `Actor`, `AccessError`, and `requireAdministrator`. Both backoffice use cases enforce the same administrator rule, so the rule lives in `domain/`.

`useCases/changeAccess/changeAccess.ts` is the application use case. It owns the operation's business rules and declares the interfaces it needs, such as `AccessWriter`. It receives implementations through dependency injection. It does not import TanStack Start, React, HTTP/request APIs, database clients, or `infra/` files. The server adapter obtains the authenticated identity and supplies the required facts or dependencies.

`useCases/changeAccess/changeAccess.functions.ts` and `useCases/listUsers/listUsers.functions.ts` are the client-callable adapters. They define `createServerFn` entry points, register Zod input schemas directly when accepting input, wire the `infra/` repositories into the use cases, and invoke them. The installed Start compiler rejects client imports of `**/*.server.*`, so RPC wrappers must use `.functions.ts`; reserve `.server.ts` for server-only implementation.

`useCases/context.server.ts` obtains the authenticated identity and current access facts, enforces request-origin rules, sets response headers, and maps application errors to HTTP failures using `failureResponse.server.ts`. `components/accessManager.tsx` receives the server functions as props, so its tests inject fakes; the page binds the real ones with `useServerFn`. `infra/users.server.ts` implements the application-owned persistence interfaces with Drizzle. The direction is page → `.functions.ts` adapter → use case; infrastructure implements interfaces that the application owns.

Start compiles server-function handlers and server-only middleware into server code and replaces their client entry points with RPC stubs. Server-only imports in `.functions.ts` must be used only inside those compiled boundaries. Client code may import the feature's `.functions.ts` entry point, but may not import `.server.ts` implementations, persistence, credentials, or runtime configuration directly. Verify this separation with both the static checks and the production build.

Keep use cases, domain rules, and infrastructure private to their owning feature. Other features consume an intentional public entry point rather than importing nested implementations. Move code into `shared` when multiple features actually use the same capability; keep shared modules organized by capability, such as notifications or layout. TanStack file routes remain thin framework entry points that compose the owning page.

Backoffice now follows this structure. Shared access bootstrap and its table remain in `src/server/modules/access` because both backoffice and `/api/me` use them. Place new feature-owned behavior inside its feature rather than introducing a top-level technical layer to satisfy a checker.

## Maintaining structure checks

Before adding or moving code or introducing a folder, apply the ownership and dependency rules above. When the intended placement conflicts with existing enforcement:

1. Update `.dependency-cruiser.cjs` to distinguish client modules, client-callable `useCases/*/*.functions.ts` adapters, plain `useCases/*/*.ts` application use cases, `domain/` rules, and `infra/*.server.ts` repositories within a feature. Preserve feature privacy and client/server isolation; replace path-wide assumptions with rules for these roles.
2. Update `scripts/prove-boundaries.mjs` in the same change. Prove allowed same-feature page-to-server-function, server-function-to-use-case, and use-case-to-domain imports. Prove rejection of use-case imports of infrastructure, domain imports of use cases or infrastructure, direct client imports of server-only implementation, and cross-feature private imports.
3. From the repository root, run `bun run lint:boundaries` and `bun run test:boundaries`. After changing server-function placement or imports, run `bun run build` and inspect `apps/web/dist/client` to verify server-only implementation and secrets are absent. Passing static import checks alone does not prove compiler extraction.
4. Update this reference and the affected architecture description to distinguish implemented enforcement from remaining gaps. Remove obsolete paths when moving an implementation.

The current checks distinguish `useCases/*/*.functions.ts` RPC entries, `.server.ts` helpers, plain `useCases/*/*.ts` use cases, `domain/*.ts` rules, and `infra/*.server.ts` repositories. Their synthetic proofs cover the allowed and rejected imports above.

## Current workspace layout

```text
apps/web/
  src/routes/                         # TanStack Start UI and server-handler routes
  src/pages/<feature>/                # page, useCases/, domain/, and infra/ code
  src/shared/<module>/                # reusable client modules
  src/style.css                       # the one stylesheet: Tailwind, initial-visual's tokens, theme, base rules
  src/server/modules/<domain>/        # server capabilities shared across feature/route consumers
  src/server/shared/<module>/         # server-only support
  tests/acceptance/integration/       # Vitest bindings of root .feature contracts (*.feature.test.ts)
  tests/typical/integration/          # technical HTTP/database integration tests without a scenario
  tests/support/                      # shared test application fixtures
  tests/acceptance/e2e/               # Playwright-BDD step bindings
  references/                         # reference designs and prototypes, outside the app
    interactive-wireframe.tsx         #   wireframe of the Later and Maybe features
    initial-visual/index.html           #   starting look of Now, light and dark (never edited)
  dist/                               # generated Worker entry and client assets
packages/
  auth/src/                           # Better Auth and provider configuration
  db/src/                              # database client, schemas, and relations
  db/migrations/<timestamp_name>/     # Drizzle 1.0.0-rc.4 folder-based migrations
  infra/alchemy.run.ts                # Alchemy Cloudflare Website.Vite and Neon project stack
  infra/src/deployment.ts             # validated dev/testing/production bindings and domains
  infra/test/alchemy.run.ts           # local acceptance Worker stack
  config/                             # workspace configuration package
shared/src/<module>/                  # optional runtime-independent cross-workspace code
tools/oxlint/anti-slop/               # vendored anti-slop Oxlint plugin (developer tooling)
features/<capability>/<use-case>.feature  # root Playwright-BDD contracts
```

The repository is a Bun workspace over `apps/*` and `packages/*`. `apps/web` is a TanStack Start application built for Cloudflare Workers. `packages/infra` uses Alchemy to run the app locally and declares a Cloudflare target and, for cloud stages, a Neon project; the test fixture separately serves the compiled Worker in `workerd`. `packages/db` uses Drizzle with the Neon serverless HTTP driver. `packages/auth` configures Better Auth and Google. These package roles describe code structure, not a verified cloud deployment.

Nothing in `apps/web/src` imports `apps/web/references/`, and `lint:boundaries` does not scan it. `apps/web` `check-types` type-checks its `.tsx` files through `tsconfig.references.json`. See [the prototype contract](../product/system/prototype.md) for what each reference covers.

Generated build output, `.alchemy`/`.tanstack` local state/cache, and generated environment types are ignored. Keep secrets in ignored local environment files. The tracked `.env.schema` files define safe environment inputs.

## Currently enforced module privacy and dependency boundaries

For modules under `apps/web/src/pages`, `apps/web/src/shared`, `apps/web/src/server/modules`, `apps/web/src/server/shared`, and `shared/src`, production files at the module root are public entry points. Nested files are private. Other modules must import through the public entry point. A module's own colocated unit tests may import its private production files; other modules may not import private implementations or tests. Production code cannot import tests.

The dependency rules also enforce these workspace boundaries:

- Client application code cannot import `.server` implementations, server routes, server environment/services, auth/database/infrastructure packages, Node APIs, or server runtime dependencies. Compiled feature `.functions.ts` entry points and server-only files are classified separately; tests and the generated route tree have explicit exceptions.
- A feature page may import its own `useCases/*/*.functions.ts` entry points. RPC adapters may import use cases, domain rules, infrastructure, and server helpers, but cannot import client pages or shared UI modules. Start transforms their server handlers into client-callable stubs.
- Plain production `.ts` files under `pages/<feature>/useCases/<useCase>/` may import only other files in that same use-case folder, `pages/<feature>/domain/` files, or runtime-independent `shared/src` modules. They cannot import `.functions.ts`, `.server.ts`, or `pages/<feature>/infra/` files. These restrictions include type-only imports.
- Production `.ts` files under `pages/<feature>/domain/` may import only other domain files of the same feature or runtime-independent `shared/src` modules.
- There is no current `packages/ui` workspace package. A reserved rule rejects server imports from that future client package shape, and synthetic boundary tests exercise it.
- Server modules and feature `.server.ts` files cannot import client pages or shared UI modules; feature use cases and adapters are classified separately.
- `shared/src` cannot depend on `apps/web`, application packages, or the framework, database, validation, and runtime dependencies listed in `.dependency-cruiser.cjs`; the rule also reserves the absent `ui` package path. Keep this code runtime-independent.
- Client shared modules cannot import page modules; server-shared modules cannot import domain modules.
- Circular dependencies and unresolved imports fail. The runtime-resolved `cloudflare:workers` import is the explicit unresolved-import exception.
- These rules also apply to `import type` dependencies. Only the circular-dependency rule ignores cycles made entirely of type-only imports, because TanStack Router's generated `apps/web/src/routeTree.gen.ts` imports the router type from `router.tsx`.

`bun run lint:boundaries` scans the application source/tests, `packages/auth/src`, `packages/db/src`, Alchemy declarations/tests under `packages/infra` (including `packages/infra/src`), and `shared/src`. `.alchemy` generated cache/state is excluded. `bun run test:boundaries` proves allowed route-to-server and own-module test imports, and rejects representative private imports, workspace package imports from client code, cross-application shared dependencies, cycles, and unresolved imports. It also creates a temporary `packages/ui` client file to prove that the reserved UI boundary rejects server imports; the package is absent from the actual workspace. These checks enforce dependency shape, not runtime behavior or provider configuration.

Backoffice's `domain/access.ts` defines the administrator rule. `useCases/changeAccess/changeAccess.ts` and `useCases/listUsers/listUsers.ts` apply it, along with self-change prevention and missing-user behavior, through injected interfaces. Their `useCases/*/*.functions.ts` adapters use `useServerFn` at the page boundary, direct Zod validation for access-change input, and no-store response middleware. `useCases/context.server.ts` owns session and HTTP concerns, and `infra/users.server.ts` owns persistence. There is no separate `src/rpc` layer.

## Test discovery

Vitest discovers colocated tests under `{apps/web,shared}/src/**/*.{spec,test}.{ts,tsx}` and `packages/*/src/**/*.{spec,test}.{ts,tsx}`. It also discovers integration tests under `apps/web/tests/{acceptance,typical}/integration/`. Playwright-BDD discovers root contracts under `features/company/` and `features/access/`, with bindings under `apps/web/tests/acceptance/e2e/`. Browser fixtures use the compiled Worker and disposable database/proxy pair. Controlled Google-like identities do not prove Google's OAuth provider. See [Testing](../../TESTING.md) for commands and current evidence limits.
