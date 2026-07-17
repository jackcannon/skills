---
name: backup-branch
description: >-
  Backup the current git branch for reference, or for safe-keeping before a risky
  git operation. Use for "backup branch", "list backups", "restore backup", or
  /backup-branch.
---

# Backup Branch

Creates a point-in-time backup of the current branch as `backup/<original-branch-name>__N` where N increments automatically.

## Create Backup

Before creating, check the current ref:

- If detached HEAD (`git rev-parse --abbrev-ref HEAD` is `HEAD`), refuse and tell the user.
- If the current branch starts with `backup/`, refuse and tell the user (avoids nested `backup/backup/...` names).

```bash
BRANCH=$(git rev-parse --abbrev-ref HEAD); N=1; while git show-ref --verify --quiet "refs/heads/backup/${BRANCH}__${N}"; do N=$((N+1)); done; git branch "backup/${BRANCH}__${N}" && echo "Created backup/${BRANCH}__${N}"
```

After running, confirm the backup branch name to the user.

## List Backups

```bash
git branch --list 'backup/*' --sort=-creatordate
```

## Restore Backup

Restore a specific backup (replaces current branch tip):

```bash
git reset --hard backup/<branch-name>__<N>
```

Restore the latest backup for the current branch:

- If detached HEAD or current branch starts with `backup/`, refuse and tell the user (same checks as create).

```bash
BRANCH=$(git rev-parse --abbrev-ref HEAD); LATEST=$(git branch --list "backup/${BRANCH}__*" --sort=-creatordate | sed 's/^[* ]*//' | head -1); git reset --hard "$LATEST" && echo "Restored from $LATEST"
```

## Notes

- Suffix increments automatically: `__1`, `__2`, `__3`, etc.
- No checkout happens — uncommitted/staged changes unaffected.
- Uncommitted changes will be lost on restore — stash first if needed.
