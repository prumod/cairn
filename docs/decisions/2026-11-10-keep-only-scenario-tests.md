# Keep only tests bound to a scenario

## Status

Decided by the user, 2026-11-10

## Context

A test either verifies a product requirement or helps an agent or developer build the code. The second kind, the typical test, is useful while the code is written: it gives fast, precise feedback on a class, a migration or a technical safeguard. After the code works, it keeps costing upkeep, and it guards nothing that a product requirement states.

Before this decision, `main` held eleven typical tests and no scenario: configuration parsing, observability and analytics helpers, the legal pages, the database client, the deployment settings, and the scripts behind the Git hooks. A mutation pilot mutated four of them.

## Decision

A test stays in the repository only when it is bound to a scenario in a `.feature` file. Every other test is a helper:

- Write helper tests freely while building.
- When a pull request needs a helper test's result as evidence, record its passing run in the pull request.
- Delete helper tests before the code review.

One exception: each repository pair (a Drizzle and an in-memory adapter) keeps its shared contract test, because later tests trust the in-memory adapter.

The eleven existing tests, the mutation pilot that depended on them, and the `check:transcriptions` script that ran one of them were deleted.

## Reconsider when

A defect reaches production that a deleted kind of test would have caught and no scenario can state, or a script behind the Git hooks breaks without anyone noticing.

## Consequences

- The scripts behind the Git hooks and checks (`check-scope.mjs`, `check-doc-links.mjs`, `transcriptions-pending.mjs`) have no tests. A defect in them shows only as a wrong gate result.
- Configuration parsing, the observability helpers, the analytics privacy options and the legal pages have no tests until a scenario covers them.
- Coverage of each layer comes from the scenarios' bindings; see [Testing](../../TESTING.md#parity-means-architectural-coverage).
