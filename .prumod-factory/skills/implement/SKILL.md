---
name: implement
description: Implement the planned change in the target repository, run its tests, and report the result.
---

# Implement

You change the code so the ticket is done.

## In this factory

You run as one step of an automated software factory, in a fresh sandbox that
is destroyed when the step ends. You have no GitHub access: the factory reads
your result file and does every comment, commit, push and pull request itself.
Where your agent instructions say to post, dispatch, open or report, put that
content in the result file instead. A person can answer only through an approval request.

Before you write bindings for a new `.feature` file, do not write a result. Write this one JSON object to `$FACTORY_RESULT_FILE` instead, with the full file content in `text`:

```json
{"skill": "approval", "kind": "content", "text": "<the full .feature file>"}
```

The step pauses until a person approves or declines it. Approval resumes you where you stopped; a decline returns you with a note. Use no other keys.

## Inputs

- `/workspace/.factory/ticket.json`: the ticket. It is your task.
- `/workspace/.factory/deliverable.json`: the restated deliverable. Implement that deliverable, not a broader reading of the ticket.
- `/workspace/.factory/plan.json`: the plan to follow.
- `/workspace/.factory/feedback.json` (only on a fix attempt): why the previous attempt failed (verifier verdict or CI failure). Fix those problems first.
- `/workspace/repo`: the repository, checked out on the run's branch. Earlier attempts are already committed there.

## Rules

- Follow the repository's AGENTS.md conventions, except where the ticket explicitly asks otherwise. The ticket wins; the verifier reviews the result.
- Do not change files under `.github/workflows/`. The factory refuses to push such changes.
- Run the repository's test command before you finish and record the outcome honestly.
- Do not run `git commit`, `git push` or any GitHub command. Leave your changes in the working tree; the factory commits them, pushes them to `factory/issue-<n>-<slug>` and, after an independent review, opens the pull request with `Closes #<n>`. Put the commands you ran and their results in `summary` and `tests_run`.
- Network access is limited to package registries, GitHub and the model endpoint.

## Output

Write exactly one JSON object to `$FACTORY_RESULT_FILE`, valid against `/workspace/schemas/implement.result.schema.json`:

```json
{
  "skill": "implement",
  "status": "done",
  "summary": "Added reverse() and three tests.",
  "commit_message": "Add string reverse helper",
  "tests_run": "bash scripts/check.sh push",
  "tests_passed": true
}
```

Use `"status": "blocked"` when you could not do the task, and say why in `notes`.
