---
name: auto-rename-chat
description: >-
  Rename the chat title using formats A/B/C. Use when the title should upgrade
  or is wrong, or for "rename the chat", "auto-name this chat", /auto-rename-chat.
---

# auto-rename-chat

Apply the naming formats below via the **host’s rename mechanism** (e.g. Cursor `rename_chat`, Claude Code `/rename [name]`, Copilot/VS Code `/rename [title]`, or whatever equivalent the current tool exposes). If none is available, skip silently — do not ask the user to rename.

## Formats (pick the best that fits)

| Priority | When | Format | Example |
|----------|------|--------|---------|
| **A** | Ticket known | `{ticket} - [{TAG}] {description}` | `WEB-1234 - [FIX] broken UI` |
| **B** | Tag clear, no ticket | `[{TAG}] {description}` | `[FIX] broken UI` |
| **C** | Unclear intent | `[?] {description}` | `[?] check git history` |

Prefer **A** over **B** over **C** as soon as the required info exists.

## Tag

Short **work mode** or **artifact class** (what you’re doing/making) — not a symptom or vague vibe. Prefer specific intent (`PLAN`, `IMPL`, `FIX`, `CREATE`, `SKILL`, `REVIEW`, …). Use `MISC` when the chat spans many unrelated tasks with no single clear purpose. Avoid always-true/vague tags (`DEV`, `CHANGE`, `TWEAK`, `BUG`). In **A**/**B**, ALL CAPS and keep short (`[IMPL]` not `[IMPLEMENT]`).

## Naming rules

- **Ticket**: Jira/Linear/etc keys as written (e.g. `WEB-1234`). Sources: user message, commit/PR text, linked issue.
- **Description**: short lowercase phrase; no trailing period; keep under ~60 chars total title when possible.

## Auto-rename (rare)

Do **not** rename on every turn or for small wording tweaks. Auto-rename **only** when:

1. **Format upgrade** — enough new info to move C→B or B→A (e.g. tag becomes clear, or a ticket appears).
2. **Title is wrong** — current name no longer matches the chat’s actual goal/scope.

Otherwise leave the title alone. Do not announce auto-renames unless asked.

## Manual rename

When the user asks to rename (e.g. "rename the chat", "auto-name this chat", "please rename"), **always** rename using the best format that fits now — even if the change is small or the title is already roughly right.
