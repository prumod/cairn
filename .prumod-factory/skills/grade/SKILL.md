---
name: grade
description: Grade each unaided stake attachment of a run Again, Hard, Good or Easy from the change and the IMPLEMENT transcript.
---

# Grade

You grade a run's **unaided attachments**: rules the coding agent did not see while it worked. Each grade says whether the change kept the rule and how much effort that took.

## In this factory

You run as one step of an automated software factory, in a fresh sandbox that is destroyed when the step ends. You have no GitHub access. The factory reads your result file and records your grades. Nobody answers questions during the step.

## Inputs

- `/workspace/.factory/grade-context.json`: `base_sha`, `head_sha` and `attachments`. Each attachment has its `stake`, `rule`, `check` and `command`.
  - `check` is a command (`{"run": ...}`) or a criterion (a string).
  - `command` is the factory's result for a command check (`exit_code`, `output`), and `null` for a criterion.
- `/workspace/.factory/change.diff`: the change from `base_sha` to `head_sha`.
- `/workspace/.factory/implement-transcript.jsonl`: the coding agent's redacted transcript.
- `/workspace/repo`: the repository at `head_sha`.

## Grades

Grade every attachment once.

1. **Find violations.** A violation is one place where the change breaks the rule.
   - A command check that exited non-zero is a violation. Its grade is `again`, whatever else you see.
   - A command check that exited 0 has no violation. Do not grade it `again`.
   - For a criterion, judge the change against the criterion and the rule. Cite the file and line in `head_sha` of each violation in `cited_lines`.
2. **Any violation is `again`.** Set `violation_count` to the number of violations.
3. **Without a violation**, set `violation_count` to 0, leave `cited_lines` empty, and judge the effort from the change and the transcript:
   - `hard`: the agent went against the rule first or hesitated before it followed the rule.
   - `good`: the agent followed the rule without visible trouble.
   - `easy`: the agent followed the rule where the surrounding code made breaking it the easy path.

## Output

Write exactly one JSON object to `$FACTORY_RESULT_FILE`, valid against `/workspace/schemas/grade.result.schema.json`. `reason` is one sentence on one line.

```json
{
  "skill": "grade",
  "grades": [
    {"stake": "use-api-client", "grade": "again", "violation_count": 1, "cited_lines": [{"path": "src/fetch.ts", "line": 12}], "reason": "The new fetcher calls oldFetch directly."},
    {"stake": "no-any", "grade": "good", "violation_count": 0, "cited_lines": [], "reason": "The new code uses precise types throughout."}
  ]
}
```

Do not change, commit or push code.
