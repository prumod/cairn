---
name: prd-research
description: Research the current code that a PRD issue's stories will touch, before technical design.
disable-model-invocation: true
---

# Research the code for a PRD

First step of the PRD workflow: `prd-research` → `prd-design` → `prd-slices` → `implement-spec`; work that fits one pull request skips `prd-slices`. This step produces a research issue; code changes belong to `implement-spec`.

The PRD issue owns the problem and behavior; `apps/web/references/initial-visual/` owns the appearance and interactions ([evolution method](../../../docs/product/system/prototype.md#método-de-evolução)). Research establishes what is true today, so design can state the delta. It is descriptive: record what exists, never what should exist.

## 1. Scope

Input: a PRD issue number, plus optionally the stories or feature IDs (for example N03, N14) to cover. Default to the whole PRD.

Read the PRD first: `gh issue view <n> --comments`.

**Size gate.** Count the words of the PRD in scope, body and comments. Scope that **sprawls** past 1,000 words is too big for one run: stop and propose child PRDs of at most 1,000 words each, ordered by user value, each a sub-issue of this PRD. Continue with the one the user picks. A `research.md` past 500 words or a design past 2,000 words is the same signal: split the scope and keep the text.

Then read in full: the part of `initial-visual/` that renders the scoped stories, and the documents [`docs/agents/domain.md`](../../../docs/agents/domain.md) lists. Choose a kebab-case slug and use `.rpi/<slug>/` (gitignored) as the draft directory.

Write the research questions as a short list at the top of `.rpi/<slug>/research.md`. Each question asks what the code does today where a scoped story will land: existing modules, data, seams, use cases, acceptance tests in `features/`, and the patterns a new slice should follow. Two branches change the questions:

- **External source**: a story depends on an API, feed, or dataset outside the repository. Ask what the source provides for that story, and answer from the source itself, with links.
- **Greenfield**: the code has nothing for the area. Say so in one line and spend the questions on the patterns to follow.

## 2. Investigate

Group related questions by area and dispatch 2–6 read-only subagents in parallel, one per area. Each returns findings with `path:line` or link evidence. Read files yourself where a finding is central or the subagents disagree.

## 3. Write

Fill `research.md` below the questions, in English:

- **Current state**: per area, what exists and how it works, with evidence.
- **Patterns to follow**: the existing examples a new slice should copy, including the test boundary.
- **Gaps**: per scoped story, what the PRD and `initial-visual/` require that the code lacks, stated as fact, without a design.
- **Conflicts**: where the code, an ADR, or `GLOSSARY.md` contradicts the PRD.
- **PRD audit**: where the PRD contradicts itself, what it leaves undefined that several stories depend on, and what could wait for a later PRD, most deferrable first.
- **Open questions**: what evidence could not settle.

Run one more targeted pass on the open questions, update the sections in place, and leave the remainder open.

**Done:** every question is answered with evidence or listed as open after that one extra pass, and `research.md` fits 500 words.

## 4. Publish

Create a GitHub issue titled `Research: <scope>` from `research.md`, and add it as a sub-issue of the PRD ([issue tracker](../../../docs/agents/issue-tracker.md)). From here on the issue is the source of truth; edit the issue, not the file.

## 5. Report

Give the research issue link, the gaps, conflicts, and PRD audit in a few lines, and the next step: `prd-design` with the PRD issue number.
