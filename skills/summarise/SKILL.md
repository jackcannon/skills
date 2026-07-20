---
name: summarise
description: >-
  Write a durable chat summary for continuity and reusable findings. Use for
  "summarise", "handover", "handoff", or /summarise.
---

# Summarise

Summarise the current conversation into a durable summary so another chat session can continue the work **and** later sessions can reuse findings (paths, examples, dead ends) via the `read-summaries` skill.

## Procedure

1. **Follow the `agent-files` skill** before writing anything:
   - Run its setup command so `.agent-files` exists and is git-ignored.
   - Write under `.agent-files/summaries/` (create the subfolder if needed).
   - Do not write summaries elsewhere unless the user explicitly asks.

2. **Determine the prefix and short name:**
   - Derive a short kebab-case name (2–4 words) describing what this chat was about.
   - **Prefix:** if this chat is tied to a ticket (e.g. a Jira key like `PROJ-1234`), use that ticket id (uppercase, as written). Otherwise use today's date (`YYYY-MM-DD`).
   - Examples with ticket: `PROJ-1234-tournament-filter-bug.md`, `ABC-99-auth-refactor.md`
   - Examples without ticket: `2026-07-17-tournament-filter-bug.md`, `2026-07-17-auth-refactor.md`

3. **Write the summary file** at `.agent-files/summaries/{prefix}-{name}.md` with this structure:

```markdown
# Summary: {Title}

## Overview

Exactly 2–3 short sentences at the top of the file so `read-summaries` can scan relevance without reading the rest. Cover: what was worked on, outcome, and current state. Do not expand Overview into Trails narrative.

## Context

- What task/ticket was being worked on
- Key decisions made
- Relevant files touched or created

## Current State

- What is done
- What is in progress
- What is NOT done / remaining work
- Uncommitted changes (if any)

## Trails

- (9/10 useful) `{exact locator}` — established X; connects A to B
- (3/10 useful) `{exact locator}` — checked for X; did not contain Y
- (8/10 useful) `{exact locator}` — must-read to continue; holds WIP / current focus

## Next Steps

- Concrete actions the next session should take to continue

## Details

Richer notes for human readers and full handovers. `read-summaries` skips this on normal scans. Put narrative here — not in Overview or Trails:

- Why decisions were made (rationale, alternatives considered)
- Edge cases, gotchas, and non-obvious constraints
- Extra context that would help a human or a dedicated handoff session
```

4. **Reply with a continuation prompt** — provide a fenced code block the user can paste into a new chat:

````
```
@file:{relative-path-to-summary-file}

Read the linked summary file completely (including Details). It contains full context from a previous session. Continue from where it left off, following the "Next Steps" section. Use the "Trails" section as prior knowledge; use "Details" for deeper rationale and edge cases.
```
````

Replace `{relative-path-to-summary-file}` with the workspace-relative path to the summary file you just created.

## Rules

- Keep the top of the file (Overview through Next Steps) short and scannable for `read-summaries`. Put longer narrative in **Details** only.
- Be concise but complete in the top sections — another agent with no prior context should be able to continue from those **and** later agents should be able to reuse "Trails" without retracing them. Use **Details** when a human or a full handoff needs more depth.
- Under **Trails**, record reusable resources with an exact locator, usefulness rating, and one short sentence explaining what each established, why it did not help, or why it is required to continue. Preserve user-supplied sources, strong evidence, reusable examples, meaningful connections, continuity must-reads, and dead ends likely to be repeated; omit routine files and incidental searches. Limit to 10 entries unless more are essential. Keep each trail to one sentence — do not turn Trails into a second Overview or move durable locators only into Details.
- **Exact locator** — use the most precise durable pointer available, for example:
  - workspace-relative path (`src/foo/bar.ts`)
  - path plus symbol (`src/foo/bar.ts:MyClass.method`)
  - URL
  - ticket id (`PROJ-1234`)
  - another summary under `.agent-files/summaries/` (so trails can link summary → summary)
- **Rating** — prefer coarse bands, not fine-grained nitpicking: **1–3** little value / weak lead; **4–6** supporting context; **7–10** strong, authoritative, or must-read to continue. Within a band, any nearby number is fine.
- Include file paths as workspace-relative paths.
- Do NOT include sensitive data (tokens, passwords, secrets).
- Do NOT include the full chat transcript — summarise intent, decisions, state, trails, and details.
- Do not delete or overwrite unrelated existing summaries.
