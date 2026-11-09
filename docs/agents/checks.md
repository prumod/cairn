# Agent Git gates

[Lefthook](https://lefthook.dev/) runs the Git hooks that `lefthook.yml` declares: `scripts/pre-commit.sh` and `scripts/pre-push.sh`. Run `bun run hooks:install` once per clone (setup and update run it after `bun install`). Git shares the installed hooks with linked worktrees, and each worktree runs its own `lefthook.yml` and scripts. Lefthook refuses to install while `core.hooksPath` is set; a clone that used the earlier `.githooks` directory must first run `git config --unset-all --local core.hooksPath`. Lefthook renames existing native hooks to `<hook>.old`.

The installed hooks run the worktree's pinned `node_modules/.bin/lefthook`, never a global copy, and `min_version` rejects an older one. In a worktree without `bun install`, they fail with `node_modules/.bin/lefthook: not found`; run `bun install` and retry.

The pre-commit hook scans the actual staged diff for secrets and, for agent sessions that need code checks, validates a disposable snapshot. This supports Git's normal content selection, including `commit -a` and path arguments. Linked worktrees still require the author configured as described in `AGENTS.md`.

Both hooks scan for secrets and check that relative Markdown links in the commit or pushed tree point to tracked files (`scripts/check-doc-links.mjs`; anchors are not checked). When `AGENT_SESSION` is unset or has a value other than `1`, these are the only content checks: the hooks skip diff classification, snapshot creation, dependency installation, formatting, lint, boundaries, transcriptions, typecheck, and build. Linked-worktree author configuration is still required for commits. Human commits and pushes target five seconds, but large outgoing histories or first-time scanner installation can take longer.

Set `AGENT_SESSION=1` in the agent launcher environment to enable the existing additional checks. Child processes inherit the variable, including Git and its hooks. Setting it in a global shell or the T3 Code service environment also marks manual terminals launched from that environment. This marker selects checks; it does not prove who triggered the Git operation.

For agent sessions, the hooks then classify the diff. If every changed path is Markdown and no non-Markdown tracked file consumes a changed document, nothing else runs. A file consumes a document when it names the document's path, or its filename when no other tracked file shares it. A file that reads Markdown (a loader) also consumes the documents in a directory it names, and every document when it uses a wildcard or recursion. Consumers are checked in both snapshots; a loader that builds paths from segments is not matched, so CI remains the backstop. Any other change runs the existing checks: formatting, lint, boundaries and transcriptions at commit; typecheck and build additionally at push. The Git author does not select the policy. Tests and dependency audits remain in CI and `bun run check`.

Pre-push reads Git's outgoing refs directly, scans outgoing history for secrets, and, for agent sessions, checks every outgoing commit's diff before deciding whether the final snapshot needs code checks. This catches code changed and later reverted. New branches or unavailable remote bases conservatively scan all reachable history. Ref deletions have no new content to validate. Dirty working files do not affect the snapshots.

Native Git bypasses such as `--no-verify` and `LEFTHOOK=0` remain available, so CI remains the shared enforcement boundary.

Each hook records per-phase durations in `<git-common-dir>/check-timings/` (newest 50 runs); `bun run checks:timings [count]` shows them. Validation leaves working files unchanged. Index comparisons detect staging changes during validation but do not atomically lock the final operation.

## Setup and recovery

With host prerequisites installed, execute `scripts/setup.sh` to prepare the locked dependencies, scanner, and browser. The human `setup-project` wizards also provision missing host tools, including Docker, start the development database from `compose.dev.yaml`, apply its migrations, and write the ignored `packages/infra/.env.local`.

The gates need Bash, Git, Bun 1.3.14, Node.js 24.11+, and Gitleaks 8.30.0. On Linux x64/arm64 the hooks run `scripts/install-gitleaks.sh` when `.tools/gitleaks` is missing, which installs the checksum-verified scanner into ignored `.tools/`; each linked worktree installs it once. On other hosts, set `GITLEAKS_BIN` to an absolute path to that version.

Install Chromium with `PLAYWRIGHT_SKIP_BROWSER_GC=1 bunx --no-install playwright install chromium` before running browser scenarios. This preserves browsers used by other local tools. CI installs its system dependencies too.

Each agent commit or push that needs code checks runs `bun install --frozen-lockfile` in a clean snapshot. Recorded runs range from 1 s, with warm caches, to 12 minutes after the Bun cache was purged or the lockfile changed. The hook prints a notice before it starts. Run `bun run checks:timings` to see where a run spent its time, and do not pipe the Git command through `tail`, which hides its exit status.

The full check (CI and `bun run check`) audits all locked dependencies, including development tools, with `bun audit`. Any reported vulnerability or unavailable advisory service blocks it. The commit and push gates omit this network-dependent step. Auditing reports findings without changing dependencies or the lockfile.

Checks report their failing invocation. Fix the relevant content, restage it for a commit, and execute the gate again. Formatting is validation-only. When a staged snapshot fails but the working tree passes, check for unstaged fixes; the gate validates the commit, not those fixes.

For test boundaries and coverage limits, see [Testing](../../TESTING.md). Package scripts and native test configuration define runnable commands and discovered files.

## Local application and test process cautions

`bun run dev` starts `packages/infra`'s Alchemy development stage, which serves TanStack Start in the local Cloudflare Workers runtime. Alchemy uses local state for this workflow; `.alchemy` is generated local state/cache, not remote provider state or proof of deployment. Standalone Vite dev/preview commands are not supported because the app requires the Workers runtime. `bun run dev:db` starts the persistent development database (PostgreSQL and the local Neon HTTP proxy) from `compose.dev.yaml` and applies pending migrations; it is separate from the disposable `compose.test.yaml` project that the test wrapper owns. Root `bun run typecheck` runs `env:generate` before workspace type checks. Keep generated `apps/web/src/env.ts` and `packages/db/src/env.ts` out of version control; retain the safe `.env.schema` inputs and keep actual credentials in ignored local environment files.

`bun run test:fast` and `bun run test:browser` build the application and use `scripts/with-test-postgres.mjs`. It starts a uniquely named Docker Compose project from `compose.test.yaml`, with digest-pinned PostgreSQL 18.6 and a pinned local Neon HTTP proxy, loopback-only dynamic ports, and temporary database storage. The wrapper supplies `TEST_DATABASE_URL` and `TEST_NEON_PORT`, then runs `docker compose down --volumes --remove-orphans`. Each app fixture creates a separate database, applies migrations through the Neon HTTP driver, and starts the compiled Worker with the test-only Alchemy stack in `packages/infra/test/alchemy.run.ts` using local `workerd` and Alchemy state. Browser fixtures add a controlled-identity proxy outside the application.

Do not start or stop a separate `pg_ctl` database for these suites. The test wrapper owns the Compose services and waits for the test process and asynchronous teardown; the browser server keeps idempotent signal handlers while cleanup finishes. CI invokes the same `scripts/check.sh full` entrypoint and relies on the wrapper's Compose pair rather than a separate PostgreSQL service. The local and CI flows do not provision Cloudflare, create remote Alchemy state, or validate Google OAuth/deployment.

For the current test and audit status, see [Testing](../../TESTING.md).

## Shared enforcement

PR CI invokes the same full check implementations without committing or pushing, regardless of `AGENT_SESSION`. Its secret scan covers the introduced commits, including secrets deleted by a later commit. The stable `Agent checks` status must be required on `main` after the workflow has run successfully. Local hooks provide early feedback; branch protection is the shared enforcement boundary.

## Migration drift

CI also runs `bun run db:generate` and fails when it writes or changes anything in `packages/db/migrations`. It catches a table change without its migration, and two pull requests that generated migrations from the same snapshot. A change that `drizzle-kit` cannot resolve alone, such as a new table that could be a rename, also fails the step (exit code 2). Generation reads no database; the step sets a placeholder `DATABASE_URL` only because the configuration requires one. To run the same check locally, run `DATABASE_URL=postgres://generate-only@127.0.0.1:5432/unused bun run db:generate` on a clean tree and expect `No schema changes, nothing to migrate`.

A pull request with a migration regenerates it after each rebase onto `main`: delete the branch's migration folder, run `bun run db:generate` (add `--hints` when it asks about renames), and commit the result. Never edit a migration that `main` already holds.

## Irreversible changes (target)

This is an agreed target design, not yet built; the [resolution](https://github.com/prumod/cairn/issues/236#issuecomment-6727314558) is the source.

The required CI check `irreversible-changes` fails a pull request that adds destructive SQL to a new migration (`DROP`, `RENAME`, `ALTER … TYPE`, `SET NOT NULL`, `DELETE`, `TRUNCATE`), changes `packages/infra/alchemy.run.ts`, or changes the backup's prune or count-guard code. It keeps failing until the pull request has the label `irreversible-reviewed`.

The review runs in this order:

1. An agent in a new session, given only the pull request diff and the checklist below, reviews the change.
2. The agent posts a pull request comment «Revisão irreversível» with an answer to each checklist item, then adds the label `irreversible-reviewed`.
3. The product owner approves the production deploy as the required reviewer of the `production` GitHub environment.

The checklist:

1. The expand step is already deployed to production.
2. No code in production still reads what is removed or narrowed.
3. A backup newer than 24 h exists.
4. The Alchemy plan shows no replace or delete of `Neon.Project`, which is retained with `RemovalPolicy.retain()` in testing and production.
5. The change keeps the backup's guards: pruning only after a successful upload, monthly backups never pruned, and counts never drop.

Only the product owner restores into production, by hand, from the backup runbook. An agent never restores production.
