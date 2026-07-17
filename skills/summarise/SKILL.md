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

Exactly 2–3 short sentences at the top of the file so `read-summaries` can scan relevance without reading the rest. Cover: what was worked on, outcome, and current state.

## Context

- What task/ticket was being worked on
- Key decisions made
- Relevant files touched or created

## Current State

- What is done
- What is in progress
- What is NOT done / remaining work
- Uncommitted changes (if any)

## Key Files

- Important files the next session should read or be aware of (workspace-relative paths)

## Findings

Reusable learnt knowledge from this session. Include concrete locations and why they matter, for example:

- Where answers or good examples were found (repo, path, symbol)
- Useful patterns discovered while implementing
- Dead ends or approaches that did not work (so they are not repeated)
- Cross-repo or cross-module references worth remembering

## Next Steps

- Concrete actions the next session should take to continue
```

4. **Reply with a continuation prompt** — provide a fenced code block the user can paste into a new chat:

````
```
@file:{relative-path-to-summary-file}

Read the linked summary file completely. It contains full context from a previous session. Continue from where it left off, following the "Next Steps" section. Use the "Findings" section as prior knowledge.
```
````

Replace `{relative-path-to-summary-file}` with the workspace-relative path to the summary file you just created.

## Rules

- Be concise but complete — another agent with no prior context should be able to continue **and** later agents should be able to mine "Findings" without re-deriving them.
- Prefer durable facts in "Findings" (paths, APIs, examples, gotchas) over ephemeral chat fluff.
- Include file paths as workspace-relative paths.
- Do NOT include sensitive data (tokens, passwords, secrets).
- Do NOT include the full chat transcript — summarise intent, decisions, state, and findings.
- Do not delete or overwrite unrelated existing summaries.
