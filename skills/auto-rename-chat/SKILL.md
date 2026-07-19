---
name: auto-rename-chat
description: >-
  Keep the chat title accurate using formats A/B/C. Auto-rename rarely — only
  on format upgrade (C→B→A) or when the current title is wrong. Also use when
  the user asks to rename the chat (e.g. "rename the chat", "auto-name this
  chat", "/auto-rename-chat").
---

# auto-rename-chat

Apply the naming formats below via the **host’s rename mechanism** (e.g. Cursor `rename_chat`, Claude Code `/rename [name]`, Copilot/VS Code `/rename [title]`, or whatever equivalent the current tool exposes). If none is available, skip silently — do not ask the user to rename.

## Formats (pick the best that fits)

| Priority | When | Format | Example |
|----------|------|--------|---------|
| **A** | Ticket known | `[{ticket}] - {Verb} {description}` | `[WEB-1234] - Dev fix broken UI` |
| **B** | Verb clear, no ticket | `[{VERB}] {description}` | `[DEV] fix broken UI` |
| **C** | Unclear intent | `[?] {description}` | `[?] check git history` |

Prefer **A** over **B** over **C** as soon as the required info exists.

## Naming rules

- **Ticket**: Jira/Linear/etc keys as written (e.g. `WEB-1234`). Sources: user message, commit/PR text, linked issue.
- **Verb**: what the chat is *doing* — e.g. plan, implement, dev, fix, debug, explore, review, refactor. In **A**, title-case the verb (`Dev`, `Plan`). In **B**, ALL CAPS inside brackets (`[DEV]`, `[PLAN]`).
- **Description**: short lowercase phrase; no trailing period; keep under ~60 chars total title when possible.

## Auto-rename (rare)

Do **not** rename on every turn or for small wording tweaks. Auto-rename **only** when:

1. **Format upgrade** — enough new info to move C→B or B→A (e.g. verb becomes clear, or a ticket appears).
2. **Title is wrong** — current name no longer matches the chat’s actual goal/scope.

Otherwise leave the title alone. Do not announce auto-renames unless asked.

## Manual rename

When the user asks to rename (e.g. "rename the chat", "auto-name this chat", "please rename"), **always** rename using the best format that fits now — even if the change is small or the title is already roughly right.
