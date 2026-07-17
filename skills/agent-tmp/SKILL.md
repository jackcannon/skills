---
name: agent-tmp
description: >-
  Use repository `.agent-tmp` for temporary files instead of OS temp dirs
  (`/tmp`, `/var/tmp`, `$TMPDIR`, `/var/folders`, `~/tmp`) or paths outside
  the repo. Use whenever creating, reading, editing, or cleaning up temporary
  files, scratch output, or disposable working files.
---

# agent-tmp

## Rules

- Do not create, edit, view, or use files under any OS temp directory (e.g. `/tmp/`, `/var/tmp/`, `$TMPDIR`, `/var/folders/…`, `~/tmp`) or other paths outside the repo unless the user explicitly asks.
- Put temporary files only in `.agent-tmp/` at the repository root.
- Treat `.agent-tmp` contents as disposable. Do not rely on them as durable project state.

## Before using `.agent-tmp`

Every time before creating or using files in `.agent-tmp`, run:

```bash
root=$(git rev-parse --show-toplevel) && mkdir -p "$root/.agent-tmp" && (git -C "$root" check-ignore -q .agent-tmp || grep -qxF '.agent-tmp' "$root/.git/info/exclude" 2>/dev/null || echo '.agent-tmp' >> "$root/.git/info/exclude")
```

This creates `.agent-tmp` at the repo root (regardless of shell `pwd`) and ensures it is git-ignored. Prefer adding `.agent-tmp` to the project `.gitignore` when you can (shared; avoids writing under `.git/`). The command falls back to `.git/info/exclude` only if the path is not already ignored.

## Cleanup

- After finishing, delete only the files/directories **you created** under `.agent-tmp`.
- Do not delete the `.agent-tmp` directory itself.
- Do not delete other agents' files in `.agent-tmp`.
