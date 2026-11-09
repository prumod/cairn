---
name: prd-design
description: Turn a PRD issue and its research into an approved technical design, published as a sub-issue of the PRD.
disable-model-invocation: true
---

# Technical design for a PRD

Second step of the PRD workflow: `prd-research` → `prd-design` → `prd-slices` → `implement-spec`; work that fits one pull request skips `prd-slices`. This step produces a design issue; code changes belong to `implement-spec`.

The design says how the system delivers the PRD's stories, starting from the look of `apps/web/references/initial-visual/`. It never changes product behavior. When the design reveals a product gap or contradiction, list it under **PRD changes** in your report, with the story number, so the user applies it to the PRD body and `initial-visual/`; the body always states the current behavior. Continue with the parts it does not block.

The design's reader is the next agent in the workflow: call the Skill tool with "writing-for-agents".

## 1. Load context

Read the PRD issue first and apply the [size gate](../prd-research/SKILL.md#1-scope) to it as it stands now.

Then read in full: the PRD's `Research: <scope>` sub-issue (when it is missing, run `prd-research` first), the scoped part of `initial-visual/`, [`CODING_STANDARDS.md`](../../../CODING_STANDARDS.md), [project structure](../../../docs/reference/project-structure.md), and the ADRs that touch the area. Investigate factual gaps in the code yourself and update the research issue.

Choose a kebab-case slug and write the skeleton of `.rpi/<slug>/design.md` (gitignored), in English: links to the PRD and the stories in scope, then empty **System design**, **Program design**, **Safeguards**, and **Decisions** sections.

## 2. Decide

Work through consequential decisions in order, starting with the one that unblocks most of the rest: **System design** first (modules, data model and migrations, server functions and endpoints, external sources, jobs), then **Program design** inside those pieces (domain types, use cases, seams, test boundaries). Express each as a delta from the research. Get the user's approval of System design before Program design.

For each consequential decision:

1. Lay out the facts and constraints from the research and the PRD.
2. Ask the user how they would approach it, one question per message, in plain words: say what each technical term means and give one concrete example. Show the options of a question about what the user sees, rather than describe them. When they already gave an approach, pressure-test it instead.
3. Surface tradeoffs and failure modes. Offer an alternative or a recommendation when it shows an important tradeoff or the user asks.
4. Record the user's choice, its rationale, and the alternatives considered under the owning section. A recommendation alone resolves nothing. The design holds the current state: a decision that replaces an earlier one rewrites that section in place, and the issue's edit history keeps the past.

Leave routine coding details to implementation. When a decision is a real tradeoff with meaningful alternatives, note it for an ADR in `docs/adr/`, written during implementation.

Under **Safeguards**, name each failure the change could cause that harms data or users, and the check or test that covers it. Mark irreversible actions, such as a destructive migration or a write to an external system; they need a fresh-context review before they run.

## 3. Audit

Dispatch one fresh-context subagent with the design, the PRD issue, and the research issue. It reports:

- inconsistencies inside the design, and between the design and the PRD;
- risks;
- PRD rules whose technical details the design leaves undefined;
- weaknesses in the codebase design: module depth, seams, names a beginner can read;
- weaknesses in the backend: endpoints, authentication, authorization, database schema, data model.

Fix each finding in the section it names. Bring a finding that is a consequential decision to the user, as in step 2.

**Done:** the audit's findings are fixed or decided, the user has reviewed the whole design top to bottom and approved it, no consequential question in scope is open, and the design fits 2,000 words.

## 4. Publish

Create a GitHub issue titled `Technical design: <scope>` from `design.md`, and add it as a sub-issue of the PRD ([issue tracker](../../../docs/agents/issue-tracker.md)). From here on the issue is the source of truth; edit the issue, not the file.

## 5. Report

Give the issue link, any **PRD changes**, and the next step with the design issue number: `implement-spec` when the work fits one pull request, otherwise `prd-slices`.
