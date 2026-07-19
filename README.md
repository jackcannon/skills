# Skills

Personal AI agent skills for Cursor, Copilot, Claude, and other agents that support the [Agent Skills](https://skills.sh/) standard.

Install any skill from this repo with [`npx skills`](https://github.com/vercel-labs/skills).

## Install

```bash
npx skills add jackcannon/skills -g
```

Useful flags:

| Flag | Meaning |
|------|---------|
| `-g` | Install globally (user-level) |
| `-y` | Skip confirmation prompts |
| `--skill <name>` | Install only the named skill |
| `--all` | Install every skill for every agent |
| `-l` / `--list` | List skills in the repo without installing |

## Skills

| Skill | Description |
|-------|-------------|
| [`agent-files`](./skills/agent-files/SKILL.md) | Keep durable agent output in repo `.agent-files` (untracked). Use when saving summaries, specs, reports, or notes across sessions. |
| [`agent-tmp`](./skills/agent-tmp/SKILL.md) | Put temp/scratch files in repo `.agent-tmp`, not OS temp dirs. Use when creating disposable working files. |
| [`auto-rename-chat`](./skills/auto-rename-chat/SKILL.md) | Rare auto-renames on format upgrade or wrong title; also on explicit “rename the chat” / “auto-name this chat”. |
| [`backup-branch`](./skills/backup-branch/SKILL.md) | Backup the current git branch for reference, or for safe-keeping before a risky git operation. Use for "backup branch", "list backups", "restore backup", or /backup-branch. |
| [`draft-mode`](./skills/draft-mode/SKILL.md) | Fast iteration — no automatic git, builds, tests, lints, or browser checks after edits. Use for "draft mode" or "/draft-mode". |
| [`read-summaries`](./skills/read-summaries/SKILL.md) | Read prior chat summaries from the `summarise` skill. Use when past session context or handovers would help. |
| [`summarise`](./skills/summarise/SKILL.md) | Write a durable chat summary for continuity and reusable findings. Use for "summarise", "handover", "handoff", or /summarise. |

## Layout

```text
skills/
└── <skill-name>/
    └── SKILL.md
```

Each skill is a folder under `skills/` with a `SKILL.md` (YAML frontmatter + instructions). Add new skills by creating a new folder here; they become installable as soon as the change is on GitHub.

## Local development

From this repo, verify the CLI discovers your skills:

```bash
npx skills add . --list
```
