# rename-chat

A Claude Code plugin. It gives the agent a tool, `mcp__rename-chat__rename_chat`, that
renames the chat. The agent does not have to ask you to type `/rename`. Cursor agents can
already rename a chat, so this plugin is for Claude Code only.

The [`auto-rename-chat`](../../skills/auto-rename-chat/SKILL.md) skill uses this tool in
Claude Code.

## How it works

Claude Code renames a chat with the `/rename` command. A tool cannot run a command while the
turn waits on the tool. So the tool queues `/rename <title>`, and the command runs when the
turn ends. The new title shows then, with the line "Session renamed to: ...".

## Install

The plugin uses Claude Code function hooks. These are early access, and the API can change
between releases. The plugin is tested with Claude Code 2.1.287.

1. Clone this repository:

   ```bash
   git clone https://github.com/jackcannon/skills.git ~/Projects/skills
   ```

2. Add the plugin folder to `CLAUDE_CODE_PLUGIN_DIRS` in `~/.claude/settings.json`. Use `:`
   between folders:

   ```json
   "env": { "CLAUDE_CODE_PLUGIN_DIRS": "~/Projects/skills/plugins/rename-chat" }
   ```

3. Let the agent use the tool without a prompt. Add this to `permissions.allow` in the same
   file:

   ```json
   "mcp__rename-chat__rename_chat"
   ```

4. Start a new Claude Code session.

## Check it

```bash
claude plugin validate plugins/rename-chat
claude plugin test plugins/rename-chat
```

Run both after a Claude Code update.

## Limits

- The new title shows when the turn ends, not at the time of the tool call.
- If the agent calls the tool two times in one turn, the last title wins.
