# repo-agents

A Claude Code plugin. It makes Claude Code use a repository's `.agents/rules` and
`.agents/skills` the same as `.claude/rules` and `.claude/skills`. Cursor and other tools
read `.agents/skills` natively, so one set of files serves every tool. The plugin writes
nothing into the repository.

## What it does

| Repository file | Result in Claude Code |
| --- | --- |
| `.agents/rules/*.md` with no `paths` key | Loads at the start of the session as a project instruction file. |
| `.agents/rules/*.md` with `paths` (or `globs`) | Loads the first time the agent reads or edits a matching file. |
| `.agents/skills/<name>/SKILL.md` | Shows in the skill list, and the Skill tool can use it. |
| A skill that the user can invoke | Also becomes a `/<name>` command. Arguments after the name become the request. |

- A skill with `disable-model-invocation: true` does not show in the skill list. The
  `/<name>` command still works.
- A skill with `user-invocable: false` does not get a `/<name>` command.
- A repository skill with the same name as an existing skill or command is skipped, and the
  plugin writes a log line.
- In the home folder, the plugin does nothing, because `~/.agents` is the global source.

## Install

The plugin uses Claude Code function hooks. These are early access, and the API can change
between releases. The plugin is tested with Claude Code 2.1.287.

1. Clone this repository:

   ```bash
   git clone https://github.com/jackcannon/skills.git ~/Projects/skills
   ```

2. Add the plugin folder to `~/.claude/settings.json`:

   ```json
   "env": { "CLAUDE_CODE_PLUGIN_DIRS": "~/Projects/skills/plugins/repo-agents" }
   ```

3. Start a new Claude Code session.

To try it for one session only, use `claude --plugin-dir ~/Projects/skills/plugins/repo-agents`.

## Check it

```bash
claude plugin validate plugins/repo-agents
claude plugin test plugins/repo-agents
```

Run both after a Claude Code update.

## Limits

- The plugin copies how Claude Code loads its own files. It is not the same code, so small
  differences can occur.
- The plugin reads the repository files once per session. Start a new session after you
  change them.
- A `/<name>` command shows "Loaded skill" first, then the reply comes as a separate turn.
