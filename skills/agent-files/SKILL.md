---
name: agent-files
description: >-
  Keep durable agent output in repo `.agent-files` (untracked). Use when
  saving summaries, specs, reports, or notes across sessions.
---

# agent-files

## Rules

- Put kept, untracked agent files only in `.agent-files/` at the repository root.
- Examples: chat session summaries, informal specs, reports, notes, other durable agent output that should not be git-tracked.
- Do not use `.agent-files` for disposable scratch files — those belong in `.agent-tmp`.
- Do not use OS temp dirs or paths outside the repo unless the user explicitly asks.
- Files in `.agent-files` are meant to persist. Do not delete them after finishing a task.
- `.agent-files` is not tracked in git. Do not treat it as shared project source of truth.

## Layout

- Do not write loose files at the `.agent-files/` root.
- Group related files into subfolders by purpose or kind (e.g. summaries, notes, specs, reports).
- Choose or create a short kebab-case plural subfolder that fits the content. Reuse an existing subfolder when it clearly fits; otherwise create a new one.
- Prefer a clear, stable path over inventing a new folder for every file.

## Before using `.agent-files`

Every time before creating or using files in `.agent-files`, run:

```bash
root=$(git rev-parse --show-toplevel) && mkdir -p "$root/.agent-files" && (git -C "$root" check-ignore -q .agent-files || grep -qxF '.agent-files' "$root/.git/info/exclude" 2>/dev/null || echo '.agent-files' >> "$root/.git/info/exclude")
```

This creates `.agent-files` at the repo root (regardless of shell `pwd`) and ensures it is git-ignored. Prefer adding `.agent-files` to the project `.gitignore` when you can (shared; avoids writing under `.git/`). The command falls back to `.git/info/exclude` only if the path is not already ignored.

## Persistence

- Leave files in `.agent-files` after the task. Do not clean them up.
- Do not delete the `.agent-files` directory.
- Do not delete or overwrite other agents' files unless the user asks.
