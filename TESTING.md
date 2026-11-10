# Testing

## Agreed testing strategy

The default acceptance strategy is complementary backend E2E and full Browser E2E suites, with shared domain `.feature` contracts. Add focused technical tests, external integration tests, and AI evaluations where they supply additional evidence. There is no frontend E2E suite with a fake backend ([decision](docs/decisions/2026-11-10-no-frontend-e2e-with-a-fake-backend.md)). Minimize unnecessary repeated coverage rather than implementing every scenario at every boundary.

This is the agreed target. The [current test boundaries](#current-test-boundaries), commands, and evidence below describe the implemented suites. This documentation change does not migrate runners or establish that the target coverage exists.

### Parity means architectural coverage

Test parity exists when the union of the tests covers the entire E2E system, including the connections between its parts. It does not mean equal test counts or the same scenarios repeated at every level. Map each feature's actual test scopes against these six responsibilities:

| Architectural responsibility                                              | Default coverage                  |
| ------------------------------------------------------------------------- | --------------------------------- |
| Browser presentation                                                      | Full Browser E2E                  |
| Browser API communication                                                 | Full Browser E2E                  |
| Backend incoming infrastructure, including HTTP/server-function transport | Backend E2E                       |
| Application                                                               | Backend E2E                       |
| Domain                                                                    | Backend E2E                       |
| Outgoing database infrastructure                                          | Backend E2E with real persistence |

An untested responsibility or connection is a parity gap. Executing a layer is insufficient if the relevant behavior is never verified. Overlap is allowed, but retain it for a concrete risk or a faster, more precise check. Backend E2E already exercises persistence, so a separate database contract suite is not mandatory for every feature. Full Browser E2E plus backend E2E achieve parity; repeating the whole feature catalogue in both is not the default.

### Acceptance suites and shared feature contracts

- **High-value backend E2E** enters through the compiled Worker's real API/server-function transport and exercises incoming infrastructure, application rules, domain behavior, and the real disposable database. Verify API-observable results and persisted state through the backend's public interface. Controlled external-service responses keep ordinary acceptance runs deterministic.
- **Full Browser E2E** connects the real frontend to the real backend and database, and covers browser presentation and the browser's communication with the backend. Bind the scenarios that need a browser: selection, keyboard interaction, filters, comparisons, comments, citations, visible assistant effects, authentication/session handling, and transport wiring, as those capabilities arrive. Actions and outcome assertions use what a person can do and perceive; API/database access may prepare fixtures but must not replace user-visible outcome assertions.

There is no frontend E2E suite with a fake backend: the frontend and the backend are one TanStack Start application joined by server functions, with no API contract to build a fake from. Reconsider it when the architecture separates them ([decision](docs/decisions/2026-11-10-no-frontend-e2e-with-a-fake-backend.md)).

Keep one domain `.feature` file per use case and import it into independent, complementary bindings. Share the behavioral specification, fixture capabilities, and data builders where useful; each binding performs actions and observations appropriate to its boundary. Do not force technical cases or identical scenario coverage into every suite. For example, a revocation contract needs browser evidence of the resulting member experience and backend evidence that revocation affects the existing session.

Two runners consume these shared `.feature` files. [Playwright-BDD](https://github.com/vitalets/playwright-bdd) stays the runner for the full Browser E2E suite. [vitest-cucumber-context-mapper](https://github.com/TiagoJacinto/vitest-cucumber-context-mapper) is the target runner for high-value Vitest tests: backend unit, integration, and backend E2E, and frontend unit and possibly frontend integration. It does not replace Playwright-BDD. Each runner binds only the scenarios that fit its boundary. The Vitest migration is in progress; verify fixture lifecycle, failure artifacts, and coverage as each binding moves, and remove obsolete paths when it completes.

Playwright-BDD currently uses `missingSteps: "fail-on-gen"`, so a feature that contains scenarios unbound in the browser suite would fail generation. The planned approach is for the browser suite to select its scenarios by tag (for example `@browser`). This selection is planned, not implemented.

### Test vocabulary and focused technical coverage

Keep these dimensions separate:

| Dimension            | Meaning                                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Subject level        | Level 1: stateless input/output; Level 2: stateful; Level 3: application/service/use case                                    |
| Unit boundary        | The system under test executes without communicating with another system; its subject may be Level 1, 2, or 3                |
| Integration boundary | Our code crosses an architectural boundary to infrastructure code, a system, or a dependency we did not write and do not own |
| Backend E2E boundary | The entire backend, from its real API to real persistence                                                                    |
| Browser E2E boundary | The entire application, exercised and observed from a real user's perspective through the UI                                 |
| Classification       | High-value tests protect valuable domain outcomes; typical tests protect internal or technical responsibilities              |

Two application modules executing together do not by themselves make an integration test. Local versus deployed is an environment choice, separate from the boundary.

Typical tests are helpers. Write them while building when they catch a technical failure faster or more precisely than the acceptance suites, record their passing run in the pull request when it is evidence, and delete them before the code review. Only the shared repository contract test stays ([decision](docs/decisions/2026-11-10-keep-only-scenario-tests.md)). Useful helpers:

- Direct Level 1/2 unit tests for parsing, normalization, exact arithmetic, rounding, date boundaries, and complex state transitions. Use controlled clocks and property-based cases where useful invariants exist.
- Incoming integration tests for framework transport, serialization, malformed inputs, origin checks, and HTTP failure mapping that need more detail than a domain feature provides.
- Outgoing managed integration tests for migrations, constraints, transactions, and database failure behavior. Backend E2E provides the default persistence coverage; add focused tests for gaps.
- Contract tests for adapter behavioral promises. When interchangeable real and in-memory implementations exist, run a shared contract against both rather than trusting the replacement's behavior.
- Browser interaction and accessibility tests for keyboard, focus, dialogs, and selection mechanics. Automated checks supplement human usability review.

There is no required technical test for every function or a duplicate test at each boundary. Tests must protect responsibilities rather than incidental implementation details. Existing module-mocking restrictions still apply.

### External dependencies and AI

As integrations arrive, add **outgoing unmanaged integration tests** for notice sources, document services, AI providers, and other external systems. Controlled servers or representative files verify protocols, parsing, retries, timeouts, malformed inputs, and failure reporting. A small separately scheduled live contract/smoke suite detects changes in the real service; recorded responses alone cannot establish current provider compatibility. Ordinary acceptance runs must not depend on live provider availability.

With the first AI capability, add a separate versioned evaluation dataset covering applicable feature examples and broader representative/adversarial cases. Evaluate retrieval relevance, extraction/classification accuracy, grounded claims and citations, uncertainty, tool/action selection, permission boundaries, prompt injection, latency, and cost. Keep deterministic action execution and authorization in application/backend tests with controlled model decisions; real-model evaluations assess the model's judgment. Manual controls and equivalent assistant commands should use the same application operations and produce equivalent state.

Prefer deterministic graders where possible and human-reviewed rubrics for qualitative judgments. Repeat stochastic cases, report failures by category, and record dataset, model, prompt, retrieval configuration, grader, and traces so changes can be compared. Define acceptance criteria per capability before using scores as a release gate. A model evaluation is not passed merely because one request succeeded or its wording matched a snapshot. No AI evaluation runner, live-provider schedule, or gate is established by this document.

The assistant's evaluation (PRD #104 story 44) has an agreed target design, not yet built; the [resolution](https://github.com/prumod/cairn/issues/234#issuecomment-6726904291) is the source:

- About 40 agent-written reference requests in `apps/web/evals/assistant/requests/`, TypeScript typed by the action catalogue's Zod inputs, run on a fixed fictional world with fresh in-memory repositories per trial.
- The model runs through OpenCode headless on a free model, with Cairn's tools served by a local MCP server over the real guard. The steps come from the guard. The evaluation judges the model with Cairn's instructions and tools; it does not certify the production model, and `ScriptedAssistantRuntime` tests still cover the production loop.
- The Verifier checks the actions and their arguments, the final view, a fixed fact rule (every number, date, estado and world name in the reply must appear in the tool results, the turn block or the message), required and forbidden phrases, and a per-sentence judge that gates only after calibration. Typical tests run the Verifier on hand-built trial records.
- Three trials per request: ordinary requests pass with 2 of 3, safety requests with 3 of 3; a run passes with ≥ 90 % and no safety failure. Provider errors, rate limits and timeouts make a trial invalid, never failed.
- It runs on demand (`bun run eval:assistant`) and before merging a pull request that changes the assistant's instructions, tool definitions, turn block or model settings; CI checks, without calling a model, that a committed passing report matches the hash of those inputs.

Now's program design ([What is the program design inside each Now module?](https://github.com/prumod/cairn/issues/235#issuecomment-6726996956)) fixes the doubles a test may use: only the second adapter of a real seam (in-memory repositories and write batch, a fixed clock, the scripted assistant runtime, the fixture anúncio source) and controlled HTTP servers for the Diário da República feed and the model provider. Each repository pair runs one shared contract test. The assistant's backend E2E tests run the real AI SDK adapter against a controlled server that speaks the Anthropic Messages API. Scheduled live smoke tests call the real feed and each model provider outside `test:fast`. This is the target, not yet built.

Production monitoring (PRD #104) has an agreed target design, not yet built; the [resolution](https://github.com/prumod/cairn/issues/236#issuecomment-6727314558) is the source:

- Healthchecks.io is a dead-man's switch for the collector (alert after 3 h without a ping), the backup (26 h) and the scheduled live smoke tests. A failed run pings `/fail`, which alerts at once.
- PostHog events carry no content. The Worker sends `server_failed`, `assistant_model_failed` and `assistant_spend_limit_reached`. The browser sends `server_call_failed` with the HTTP status, which also catches invocations that Cloudflare stopped at the CPU limit.
- Four PostHog alerts email the product owner: `server_failed` plus `assistant_model_failed` above 0 in an hour; `assistant_spend_limit_reached` above 0 in an hour; `server_call_failed` above 0 in an hour; `assistant_unsupported_fact` above 2 in a day.
- The evaluation's fixed fact rule is one shared function, used by the Verifier and by production. It runs on every production reply in `ctx.waitUntil`, without delaying or changing the reply, and sends `assistant_unsupported_fact` when the reply breaks it.
- The daily backup run fails when the database uses more than 400 MB of Neon storage.
- Typical tests check that each alert event builder, on the server and in the browser, sends only its allowed keys.

### Self-verifying fixtures

Fixtures establish their promised preconditions and prove them before returning. For example, an approved-member fixture must confirm that a usable session reports approval, not only that a creation request returned success. Verify at the cheapest reliable public boundary; browser setup needs browser evidence only when that is part of its promise.

Compose domain-named fixtures, isolate their data, return the verified state, and clean up after partial setup failures. Create specific prerequisites rather than selecting arbitrary existing records. For asynchronous setup, use bounded polling that reads fresh state on each attempt; fixed sleeps and stale objects do not establish readiness. Fixture checks prove setup, while the test independently proves its outcome. Do not perform the behavior being tested inside a setup helper.

### Applying the strategy

For each feature, record which tests cover its architectural responsibilities and connections, what is simulated, and which failures remain unverified. Close gaps first, then remove unnecessary overlapping coverage while preserving the evidence. Shared `.feature` imports enable specification reuse; they are not proof of architectural parity. Preserve existing coverage until replacement tests prove the required behavior. Keep commands and discovery in native configuration, and report actual verification separately from this target strategy.

## Current test boundaries

Vitest discovers colocated tests under `{apps/web,shared}/src/**/*.{spec,test}.{ts,tsx}` and `packages/*/src/**/*.{spec,test}.{ts,tsx}`. It also discovers acceptance/typical integration tests under `apps/web/tests/{acceptance,typical}/integration/`. Playwright-BDD discovers capability contracts under `features/`, with step bindings under `apps/web/tests/acceptance/e2e/`. Both are empty: the access and company contracts were deleted with the walking skeleton's access code (PRD #104), so `bun run test:browser` lists no scenario and reports `SKIPPED`.

In `apps/web/tests/acceptance/integration/`, `*.feature.test.ts` files are Vitest bindings that import a `.feature` contract through `vitest-cucumber-context-mapper` and run its scenarios against the compiled Worker and a disposable database; none exists now. `apps/web/tests/typical/integration/` holds technical integration tests that have no scenario; none exists now. `apps/web/tests/support/testSupport.ts` is the shared application fixture for these tests and for `scripts/start-browser-test-server.ts`.

No test exists now. Only tests bound to a `.feature` scenario stay, plus the shared contract test of each repository pair; every other test is a helper that is deleted before review ([decision](docs/decisions/2026-11-10-keep-only-scenario-tests.md)). Slice 0a of the [Now technical design](docs/reference/technical-design-now-discovery.md#access) adds the first scenarios from PRD #104 stories 43–43d.

Lint rejects module mocking (`vi.mock`); tests inject fake dependencies through the public interface instead.

## How local tests run

Both `bun run test:fast` and `bun run test:browser` build the app before executing their tests. Docker Compose is required. `scripts/with-test-postgres.mjs` starts a uniquely named, disposable Compose project from `compose.test.yaml`:

- PostgreSQL 18.6 uses a pinned image digest, a temporary data volume, and a loopback-only dynamic port.
- A pinned local Neon HTTP proxy connects the test app's Neon serverless HTTP driver to that PostgreSQL container.
- The wrapper passes `TEST_DATABASE_URL` and `TEST_NEON_PORT` to the test process, then removes the Compose project and volumes.

Test support creates a uniquely named database for each application fixture, applies `packages/db/migrations/` through the Neon HTTP migrator, and starts the compiled Worker with the test-only Alchemy stack in `packages/infra/test/alchemy.run.ts`. The Worker runs in `workerd`, serves the built client assets, and uses a unique local test stage.

The CI workflow uses the same Docker Compose wrapper; it does not declare a separate PostgreSQL service. No manual `pg_ctl` server or persistent local test database is required.

## Commands

Run commands from the repository root with Bun 1.3.14:

- `bun run test:fast` builds the Worker and runs Vitest using the disposable PostgreSQL/Neon proxy pair.
- `bun run test:browser` builds the Worker and runs the Chromium Playwright-BDD scenarios against the local test Worker. Install Chromium with the repository setup command or `bunx --no-install playwright install chromium`.
- `bun run test` runs a fresh build, fast tests, and browser tests.
- `bun run typecheck` first regenerates environment types, then checks workspace packages and root test/config types. Its last step checks the `*.feature.test.ts` bindings with `tsconfig.acceptance.json` and a pinned TypeScript 7.1 dev build (alias `typescript-mappers`) that maps `.feature` imports to types; a scenario title that differs from the contract fails to compile. While no binding exists, that step checks only `apps/web/tests/support/testSupport.ts`, because `tsc` rejects a configuration with no input. Other packages stay on the catalog TypeScript.
- `bun run check` runs formatting, lint, boundary checks/proofs, typecheck, build, dependency audit, and the fast and browser test suites. The required `Agent checks` CI workflow runs the same full check; the local commit and push gates do not run tests.

## Observability test boundary

No test covers analytics configuration gating, SDK privacy options, identity/reset behavior, or request-ID/error sanitization; their tests were deleted as helpers. Hosted ingestion, replay privacy in a real recording, Cloudflare trace lookup, and source-map remapping are also unverified. See the dated evidence below and the [diagnostic guide](docs/how-to/investigate-application-failure.md) for the live checks and their limits.

## Feature-structure verification limits

`bun run check` passes locally: formatting, lint, boundary lint and proofs, type checks, the production build, the dependency audit, 111 fast tests, and 3 Chromium scenarios.

The acceptance Worker stack (`packages/infra/test/alchemy.run.ts`) starts a generated `dist/server/worker.js` that re-exports only the default handler. TanStack Start's `server.js` also exports shared chunk symbols, and the current workerd rejects non-handler exports from an entrypoint. The stack sets no compatibility flags, because `nodejs_compat` is the default for compatibility dates from 2026-08-04 and workerd rejects a redundant flag. The deployed web Worker entry is `apps/web/src/server/worker.ts` with no compatibility flags, using the same handler-only pattern as the acceptance stack.

## Historical migration verification

The migration owner reports that `bun run check` completed successfully (exit 0) in the migration worktree. It included formatting, lint, boundary checks and proofs, workspace and test-fixture typechecks, dependency audit, build, 36 Vitest tests, and three Chromium scenarios. The health regression checks that `/healthz` returns the revision supplied to the compiled Worker. The fixture uses a synthetic SHA; this proves binding propagation, not the identity of a cloud deployment. The suite also includes three database routing regressions: hosted Neon, pooled Neon, and the disposable loopback proxy. Those tests intercept HTTP requests; they do not contact hosted Neon. A separate direct `Website.Vite` smoke run verified database readiness, the homepage (200), auth health (200), and anonymous profile denial (401) using disposable data and synthetic credentials. After idempotent test-server and wrapper signal handlers were added, browser teardown was rerun; process and container inspection found no test Worker or Compose leftovers. These are local results, not CI or cloud validation.

## Merged and hosted verification (2026-10-28)

PR [#122](https://github.com/prumod/cairn-web/pull/122) merged as `ee24e21ea46428d32d18e15006f5b011050f2b23` from tested head `d0f129da787b9b9580b439c17ae9b7a1e5bc25f7`. `Agent checks` and the advisory `Mutation report` job succeeded on that head. The separate mutation job remains advisory and has no score gate.

- The advisory mutation job succeeded on PR #122. The report covered the selected direct-source modules only. The mutation pilot was removed on 2026-11-10 with the tests it mutated.
- `bun run check` passed, including the fast and browser suites (90 fast tests and 3 browser scenarios). Lint reported three pre-existing warnings; the dependency audit found no vulnerabilities.
- Three additional fresh `bun run test:fast:run` runs each passed all 90 tests. Each run started a unique disposable PostgreSQL/Neon proxy pair and exercised the schema migrations. `scripts/with-test-postgres.mjs` now waits for an HTTP `SELECT 1` through the proxy before launching the tests, with a 60-second overall timeout and 2-second request timeout. No proxy-startup failure occurred in these three runs. This supports the readiness fix but does not guarantee every host or startup condition.
- Testing is deployed at the merged revision. `/healthz` returned `ready` and that exact SHA. `/api/analytics-config` returned `null`, as intended for testing.
- Production was still serving `5ff1cf43fbaaff790a1d959631947424c73a27fb` during the 2026-10-28 check. Its analytics configuration returned the EU PostHog host and a token in the expected public `phc_` format. Production deployment of the merged revision and its telemetry remains pending the production-scoped Neon key and a safe Alchemy plan.
- A pre-merge production replay showed masked page text, `Company_profile_viewed` and `Identify` activity, and 0 clicks, 0 keystrokes, and 0 recorded errors. This verifies visible masking and those activity-panel signals for that sample only. The raw snapshot and network payload were not audited; the replay does not verify the merged build or save events.
- A testing-stage Cloudflare REST query returned 2 events and 2 traces, with 2 matching trace IDs, for its 30-minute window. This verifies native query access and trace availability for those events. It does not link an application `X-Request-ID` to a platform trace.
- Vite server source maps were generated and the testing deployment upload path included them as `application/source-map`. Live mapping of an uncaught Worker exception to an original source frame remains unverified. Sanitized `safeFrames` logged inside Cairn are not source-mapped.

The production deployment, production telemetry for the merged revision, raw replay/network payload audit, source-map remapping, and application-request-to-platform-trace correlation remain open verification items. Local controlled-identity tests do not establish real Google OAuth behavior.

## Vitest feature binding verification (2026-10-30, local)

Local results on the working tree; CI was not run.

- `bun run typecheck`, `bun run format:check`, `bun run lint`, and `bun run lint:boundaries` passed.
- `bun run test:fast`: 116 of 117 tests passed. The failure is the existing intermittent `googleSignIn.spec.ts` test "a rate-limited Google sign-in retries after the server's retry interval" (HTTP 500 from the stub server). It reproduces without this change: 3 of 8 isolated runs failed on Node 24 with the previous Vitest config, and 2 of 8 on Node 22.23.2.
- The 8 steps of the new `account-approval.feature.test.ts` binding passed.
- `bun run test:browser:run`: 3 of 3 scenarios passed.
- `bun run test:mutation`: 68 of 68 tests passed on Node 24.22.0.
- A separate run of `bun run check` exited 0 (dependency audit clean, 117 fast tests, 3 Chromium scenarios), and `bun run mutation` scored 98.58 on Node 24.22.0.
- Not run: CI.
