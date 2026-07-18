---
name: agent-tmp
description: >-
  Put temp/scratch files in repo `.agent-tmp`, not OS temp dirs. Use when
  creating disposable working files.
---

# agent-tmp

## Rules

- Do not create, edit, view, or use files under any OS temp directory (e.g. `/tmp/`, `/var/tmp/`, `$TMPDIR`, `/var/folders/…`, `~/tmp`) or other paths outside the repo unless the user explicitly asks.
- Put temporary files only in `.agent-tmp/` at the repository root.
- Treat `.agent-tmp` contents as disposable. Do not rely on them as durable project state.

## Before using `.agent-tmp`

Every time before creating or using files in `.agent-tmp`, run:

```bash
cd "$(git rev-parse --show-toplevel)" && mkdir -p .agent-tmp && git check-ignore -q .agent-tmp || { echo "agent-tmp: .agent-tmp is not git-ignored; run the exclude follow-up command"; exit 1; }
```

If that exits non-zero, run this follow-up once (may need VS Code approval; writes `.git/info/exclude`):

```bash
grep -qxF '.agent-tmp' .git/info/exclude || echo '.agent-tmp' >> .git/info/exclude
```

Prefer project `.gitignore` only if the user asks to make the ignore shared/tracked. Do not use `/dev/null` redirects.

## Cleanup

- After finishing, delete only the files/directories **you created** under `.agent-tmp`.
- Do not delete the `.agent-tmp` directory itself.
- Do not delete other agents' files in `.agent-tmp`.
