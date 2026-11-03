---
name: implement-spec
description: Implement one spec issue through ATDD and open its pull request.
disable-model-invocation: true
---

# Implement a spec

Inside the spec, routine implementation is yours to decide. Stop for the user only at a boundary change: evidence that contradicts the spec or what it references, a consequential decision the spec leaves open, or an irreversible action the spec does not cover. Report the evidence, the impact, and the decision needed; continue with unaffected work.

## 1. Load context

Read the spec issue with comments, and every issue it references: blockers (they must be closed), the design issue, and the PRD stories. When the spec delivers UI, read the part of `apps/web/references/final-visual/` it replicates. Run `git fetch origin` and confirm the branch contains `origin/main`; when it does not, ask the user before continuing from a stale base.

## 2. Implement

Call the Skill tool with "atdd" to drive the spec's behavior to green through its `.feature` scenarios.

- UI replicates `final-visual/` exactly and uses production services instead of fictitious data and simulated actions ([evolution method](../../../docs/product/system/prototype.md#produção--réplica-exata-do-final-visual)).
- Write the ADRs the spec notes, and update the documentation [`docs/agents/documentation.md`](../../../docs/agents/documentation.md) requires.
- Before an irreversible action marked in the spec, get a fresh-context, read-only review of its safeguards and record the result in the PR.
- When this change completes the replication of `final-visual/`, delete `apps/web/references/final-visual/` in the same change.

## 3. Verify

Run `bun run check`. Fix failures until it passes; for a failing hook, read [`docs/agents/checks.md`](../../../docs/agents/checks.md).

**Done:** the spec's scenarios pass, `bun run check` passes, and each acceptance criterion in the spec is met.

## 4. Pull request

Call the Skill tool with "prd-describe-pr".
