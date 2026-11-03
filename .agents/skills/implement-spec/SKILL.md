---
name: implement-spec
description: Implement one spec issue and its tickets through ATDD on a single integration branch, then open its pull request.
disable-model-invocation: true
---

# Implement a spec

The goal is the entire spec implemented on a single **integration branch**, with one pull request that closes the spec and every ticket.

The spec's sub-issues are its tickets ([issue tracker](../../../docs/agents/issue-tracker.md)). They are not a list of steps but a **task graph** with blocking edges, so there is always a **frontier** of tickets ready to grab. A ticket joins the frontier when every ticket blocking it is merged into the integration branch; issues close only when the pull request merges. A spec without sub-issues is a graph of one ticket: the spec itself.

Inside the spec, routine implementation is yours and your workers' to decide. Stop the affected work for the user only at a boundary change: evidence that contradicts the spec or what it references, a consequential decision the spec leaves open, or an irreversible action the spec does not cover. Report the evidence, the impact, and the decision needed; continue with unaffected tickets.

Start every worker with a fresh context. Keep communication with workers sparse: brief them through **context pointers** (the spec, ticket, design and PRD issues, research notes, previous commits) rather than restating what those hold.

## Steps

1. **Read the task graph.** Read the spec and every ticket with comments, the design issue and PRD stories they reference, and, for tickets that deliver UI, the part of `apps/web/references/final-visual/` they replicate.

2. **Create the integration branch** from current `origin/main`.

3. **Approve the scenarios.** Call the Skill tool with "atdd" for the acceptance behavior of every ticket, and stop after the approved feature files are written; implementers drive them to green. Commit the approved `.feature` files to the integration branch. This keeps scenario approval with the user and lets workers run without asking.

4. **(Optional) Explore.** When tickets need shared exploration of the code or external documentation, run one exploration worker that saves markdown notes outside the repository, in a directory every later worker can read. Reuse `.rpi/<slug>/research.md` when `prd-research` already covers it.

5. **Dispatch implementers.** For each frontier ticket, start one implementer worker in the background, in its own worktree on its own branch: `delegate_task` with `isolation: "worktree"`. Each implementer:
   - confirms its worktree is based on the integration branch tip, and resets onto it if not;
   - runs `scripts/use-github-identity.sh <login>` with the login the integration branch commits use;
   - calls the Skill tool with "hvtdd" to drive its ticket's approved scenarios to green;
   - replicates `final-visual/` exactly for its UI, with production services instead of fictitious data and simulated actions ([evolution method](../../../docs/product/system/prototype.md#produção--réplica-exata-do-final-visual));
   - writes the ADRs its ticket notes and updates the documentation [`docs/agents/documentation.md`](../../../docs/agents/documentation.md) requires;
   - stops before an irreversible action until a fresh-context, read-only review of its safeguards is recorded;
   - merges the integration branch tip into its branch and passes `bun run check` before reporting done.

6. **Merge.** When an implementer completes, a **merger** worker merges its branch into the integration branch, resolves conflicts against the tickets' intent, and passes `bun run check` on the result. After the first merge, push the integration branch and open a draft pull request.

7. **Advance the frontier.** When a merge unblocks tickets, dispatch implementers for them. Repeat steps 5–7 until every ticket is merged.

8. **Review.** Call the Skill tool with "code-review" on the integration branch against `origin/main`. Fix every finding in a single fresh implementer worker, merge it, and pass `bun run check`.

9. **Finish.** When the integration branch completes the replication of `final-visual/`, delete `apps/web/references/final-visual/` in the same branch. Call the Skill tool with "prd-describe-pr" to describe the pull request; it closes the spec and every ticket. Mark the pull request ready for review.

10. **Clean up** every worker worktree.

**Done:** every ticket is merged into the integration branch, `bun run check` passes on it, code-review findings are fixed, and the ready pull request closes the spec and every ticket.
