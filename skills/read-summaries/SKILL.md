---
name: read-summaries
description: >-
  Read prior chat summaries from the `summarise` skill. Use when past
  session context or handovers would help.
---

# Read Summaries

Extra context from past chats may live in `.agent-files/summaries/` at the repo root (`{ticket-or-date}-{short-name}.md`). If the folder is missing or empty, continue without it.

## How to use

1. List the folder. Filenames encode ticket/date + topic — use those to shortlist.
2. For candidates, read only the **Overview** (2–3 lines at the top) to check relevance.
3. For relevant files, read the rest as needed:
   - **Findings** — reusable knowledge (paths, examples, dead ends)
   - **Key Files** / **Current State** / **Next Steps** — continuity
4. Apply what helps; cite the summary path. Do not dump whole files unless asked.
