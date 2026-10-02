import type { Register } from 'claude-code'
import { cleanTitle } from './lib.ts'

// Gives the agent a tool that renames the chat, as Cursor's agent can.
//
// Claude Code renames a chat with the /rename command. A tool cannot run a command while
// the turn waits on the tool, so the tool queues /rename from a timer, outside the call.
// The command runs when the turn ends, and the new title shows then.

const TOOL = 'rename_chat'

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    await $.tool.register({
      name: TOOL,
      description:
        'Renames this chat (the session title). Use it when a skill or the user asks to rename the chat. ' +
        'The new title shows when the current turn ends, so do not call it twice for one title.',
      inputSchema: {
        type: 'object',
        properties: { title: { type: 'string', description: 'The new chat title, on one line.' } },
        required: ['title'],
      },
    })
    return result
  })

  on('tool.call', { tool: 'mcp__rename-chat__rename_chat' }, ($, e) => {
    const title = cleanTitle((e as unknown as { title?: unknown }).title)
    if (title === undefined) return { deny: 'rename_chat needs a title that is not empty.' }
    $.clock.after(0, () => {
      $.command.run({ command: 'rename', args: title }).catch(err => $.ui.log(`rename-chat: /rename failed: ${String(err)}`))
    })
    return { result: `The chat is renamed to "${title}" when this turn ends.` }
  })
}
