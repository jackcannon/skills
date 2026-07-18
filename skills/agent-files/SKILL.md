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
cd "$(git rev-parse --show-toplevel)" && mkdir -p .agent-files && git check-ignore -q .agent-files || { echo "agent-files: .agent-files is not git-ignored; run the exclude follow-up command"; exit 1; }
```

If that exits non-zero, run this follow-up once (may need VS Code approval; writes `.git/info/exclude`):

```bash
grep -qxF '.agent-files' .git/info/exclude || echo '.agent-files' >> .git/info/exclude
```

Prefer project `.gitignore` only if the user asks to make the ignore shared/tracked. Do not use `/dev/null` redirects.

## Persistence

- Leave files in `.agent-files` after the task. Do not clean them up.
- Do not delete the `.agent-files` directory.
- Do not delete or overwrite other agents' files unless the user asks.
