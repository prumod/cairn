# No frontend E2E suite with a fake backend

## Status

Decided by the user, 2026-11-10

## Context

[Testing](../../TESTING.md#acceptance-suites-and-shared-feature-contracts) used to set a target with three acceptance suites: frontend E2E with a fake backend, backend E2E, and a small full Browser E2E suite. The fake-backend suite was never built.

The frontend and the backend are one TanStack Start application. The browser calls the backend through server functions, not through an API with its own contract:

- A server function travels over Start's internal format (`/_serverFn/<id>`, seroval encoding). No contract document describes it.
- Generators such as Kubb and Orval read OpenAPI only, so they cannot produce the fake, the Zod schemas or the TanStack Query hooks from server functions.
- A fake would be either hand-written replies in that internal format, or a second test build that swaps each `.functions.ts` file. Both depend on Start internals, and both need a separate check that the fake still matches the real backend.

## Decision

Cairn has no frontend E2E suite with a fake backend.

- Backend E2E, through the compiled Worker's real server-function transport and a disposable database, covers the backend and the shared `.feature` contracts.
- Full Browser E2E, with the real frontend, backend and database, covers browser presentation and the browser's communication with the backend. Playwright-BDD binds only the scenarios that need a browser.
- No fake backend, and no real/fake compatibility check, is built or maintained.

## Reconsider when

The architecture changes so that the frontend and the backend are separate, with an explicit API contract between them. A fake generated from that contract then becomes a reasonable option.

## Considered options

- **Swap each `.functions.ts` for a scripted fake in a test build.** Start's real transport runs, but the swap is untested against Start's compiler and adds a second build.
- **Intercept server-function calls with Playwright `page.route`.** The hand-written encoder can drift from Start's format.
- **Put an OpenAPI or oRPC layer in front of the backend and generate the fake.** This replaces server functions, against the [technical design](../reference/technical-design-now-discovery.md#server-functions-sign-in-and-access).

## Consequences

- Every browser scenario runs the real backend and database, so the browser suite is slower than a fake-backend suite would be, and a backend failure is harder to produce on demand in a browser test.
- The full Browser E2E suite is no longer limited to a few journeys: it carries all browser presentation coverage.
- The browser scenarios carry the tag `@browser`; the earlier `@frontend` tag, which meant the fake-backend suite, is gone.
