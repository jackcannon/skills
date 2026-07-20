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
   - **Trails** — reusable locators with usefulness ratings (paths, symbols, URLs, tickets, other summaries; what helped, what did not, must-reads). Follow high-rated trails; skip or deprioritise low-rated dead ends.
   - **Current State** / **Next Steps** — continuity
4. **Skip Details** on normal scans — that section is for human readers and full handovers. Only read it when this is a dedicated handoff/continuation of that summary, or when Overview + Trails + Current State are not enough.
5. Apply what helps; cite the summary path. Do not dump whole files unless asked.
