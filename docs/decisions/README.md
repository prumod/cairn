# Decisions

One file per decision that is not an [ADR](../adr/): a choice about process, testing, tooling or scope that a later reader could question, and that is cheap to reverse. An ADR is for a consequential trade-off that code or data depend on.

- **File name:** `YYYY-MM-DD-short-title.md`, dated on the day of the decision.
- **Sections:** Status (who decided, and when), Context, Decision, and Reconsider when. Add Considered options and Consequences when they help.
- **Keep it true.** The document that owns the subject, such as [Testing](../../TESTING.md), states the current rule and links to the decision for the reason. A later decision that replaces this one marks it «Superseded by» and links to its successor; do not delete it.

## Index

- [2026-11-10: No frontend E2E suite with a fake backend](2026-11-10-no-frontend-e2e-with-a-fake-backend.md)
- [2026-11-10: Keep only tests bound to a scenario](2026-11-10-keep-only-scenario-tests.md)
