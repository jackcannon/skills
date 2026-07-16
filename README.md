# Skills

Personal AI agent skills for Cursor, Copilot, Claude, and other agents that support the [Agent Skills](https://skills.sh/) standard.

Install any skill from this repo with [`npx skills`](https://github.com/vercel-labs/skills).

## Install

Install all skills:

```bash
npx skills add jackcannon/skills
```

Install a specific skill:

```bash
npx skills add jackcannon/skills --skill whoami
```

Install globally (available across projects):

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
| [`draft-mode`](./skills/draft-mode/SKILL.md) | Fast iteration: no git/build/test/lint/browser verification after edits unless explicitly asked (one-time only) |
| [`whoami`](./skills/whoami/SKILL.md) | Runs `whoami` and returns only the username |

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
