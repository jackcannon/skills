import type { EngineInterface, Register } from 'claude-code'
import { globsOf, listingLine, matchesAny, parseFrontmatter, relativeTo } from './lib.ts'

// Makes Claude Code treat a repository's .agents/rules and .agents/skills the way it
// treats .claude/rules and .claude/skills, without writing anything into the repository.
//
//   rules without `paths`   loaded as project instruction files at the start of a session
//   rules with `paths`      attached the first time a matching file is read or edited
//   skills                  listed for the model, served through the Skill tool, and
//                           registered as /name slash commands

type Rule = { path: string; body: string; globs: string[] }
type Skill = { name: string; dir: string; description: string; body: string; modelInvocable: boolean; userInvocable: boolean }
type Repo = { root: string; rules: Rule[]; skills: Map<string, Skill> }

const FILE_TOOLS = new Set(['Read', 'Edit', 'Write', 'NotebookEdit'])

// Module state: a hot reload starts it over, which only means one more read.
let repo: Repo | undefined
let isListed = false
const attached = new Set<string>()

async function load($: EngineInterface): Promise<Repo> {
  const root = await $.session.root()
  if (repo?.root === root) return repo
  repo = { root, rules: [], skills: new Map() }
  attached.clear()
  isListed = false
  // At the home folder, .agents is the global source, which ~/.claude already links.
  const home = await $.env.get('HOME')
  if (home !== undefined && (await realPath($, `${root}/.agents`)) === (await realPath($, `${home}/.agents`))) return repo
  repo.rules = await readRules($, `${root}/.agents/rules`)
  repo.skills = await readSkills($, `${root}/.agents/skills`)
  return repo
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    const { skills } = await load($)
    const taken = new Set((await $.command.list()).map(c => c.name))
    for (const s of skills.values()) {
      if (taken.has(s.name)) {
        $.ui.log(`repo-agents: .agents/skills/${s.name} is not added, because a skill or command with that name exists.`)
        skills.delete(s.name)
      } else if (s.userInvocable) {
        await $.command.register({ name: s.name, description: `${s.description} (repo .agents/skills)` })
      }
    }
    return result
  })

  // Rules without `paths`: project instruction files, beside CLAUDE.md.
  on('prompt.context', async ($, e, next) => {
    if (e.instructionFiles === undefined) return next(e)
    const { rules } = await load($)
    const known = new Set(e.instructionFiles.map(f => f.path))
    const added = rules
      .filter(r => r.globs.length === 0 && !known.has(r.path))
      .map(r => ({ path: r.path, kind: 'project' as const, content: r.body }))
    return next(added.length ? { ...e, instructionFiles: [...e.instructionFiles, ...added] } : e)
  })

  // Rules with `paths`: attached once, when the model first reads or edits a matching file.
  on('tool.call', async ($, e, next) => {
    const result = await next(e)
    if (!FILE_TOOLS.has(String(e.tool)) || result.deny !== undefined || result.isError) return result
    const input = e as unknown as { file_path?: string; notebook_path?: string }
    const file = input.file_path ?? input.notebook_path
    if (!file) return result
    const { root, rules } = await load($)
    const rel = relativeTo(root, file)
    if (rel === undefined) return result
    const due = rules.filter(r => r.globs.length > 0 && !attached.has(r.path) && matchesAny(rel, r.globs))
    if (!due.length) return result
    due.forEach(r => attached.add(r.path))
    const notes = due.map(r => `Contents of ${r.path} (project rule for files matching ${r.globs.join(', ')}):\n\n${r.body}`)
    return { ...result, context: [...(result.context ?? []), ...notes] }
  })

  // Skills: add them to the listing the model reads, once per conversation.
  on('prompt.attachment', { type: 'skill_listing' }, async ($, e, next) => {
    const { skills } = await load($)
    const lines = [...skills.values()].filter(s => s.modelInvocable).map(s => listingLine(s.name, s.description))
    if (isListed || !lines.length) return next(e)
    isListed = true
    return next({ ...e, text: `${e.text}\n${lines.join('\n')}` })
  })

  on('session.compact', async ($, e, next) => {
    const result = await next(e)
    isListed = false
    attached.clear()
    return result
  })

  // Skills: answer the Skill tool for repo skills, the way it answers for its own.
  on('tool.call', { tool: 'Skill' }, async ($, e, next) => {
    const { skills } = await load($)
    const s = skills.get(e.skill.replace(/^\//, ''))
    if (!s || !s.modelInvocable) return next(e)
    return {
      result: { success: true, commandName: s.name, status: 'inline' as const },
      context: [skillText(s, e.args)],
    }
  })

  // Skills: /name args, typed by the person. Record the skill, then start the turn that uses it.
  // The submit runs from a timer, outside this dispatch, so the dispatch's end cannot cancel it.
  on('command.run', async ($, e, next) => {
    const { skills } = await load($)
    const s = skills.get(e.command)
    if (!s || !s.userInvocable) return next(e)
    const text = e.args.trim() || `Apply the ${s.name} skill.`
    $.clock.after(0, () => {
      $.prompt.submit({ text, asUser: true }).catch(err => $.ui.log(`repo-agents: /${s.name} could not start its turn: ${String(err)}`))
    })
    return { text: `Loaded skill ${s.name} from .agents/skills.`, context: [skillText(s, e.args)] }
  })
}

function skillText(s: Skill, args: string | undefined): string {
  const tail = args?.trim() ? `\n\nARGUMENTS: ${args.trim()}` : ''
  return `Base directory for this skill: ${s.dir}\n\n${s.body.trim()}${tail}`
}

async function realPath($: EngineInterface, path: string): Promise<string | undefined> {
  return $.fs.stat(path, { resolve: true }).then(s => s.realPath, () => undefined)
}

async function listNames($: EngineInterface, dir: string, kind: 'file' | 'dir'): Promise<string[]> {
  const entries = await $.fs.list(dir).catch(() => [])
  const names: string[] = []
  for (const en of entries) {
    if (en.kind === kind) names.push(en.name)
    else if (en.isLink && (await $.fs.stat(`${dir}/${en.name}`).catch(() => undefined))?.kind === kind) names.push(en.name)
  }
  return names.sort()
}

async function readRules($: EngineInterface, dir: string): Promise<Rule[]> {
  const rules: Rule[] = []
  for (const name of await listNames($, dir, 'file')) {
    if (!name.endsWith('.md')) continue
    const path = `${dir}/${name}`
    const text = await $.fs.read(path).catch(() => undefined)
    if (typeof text !== 'string') continue
    const { data, body } = parseFrontmatter(text)
    rules.push({ path, body: body.trim(), globs: globsOf(data) })
  }
  return rules
}

async function readSkills($: EngineInterface, dir: string): Promise<Map<string, Skill>> {
  const skills = new Map<string, Skill>()
  for (const name of await listNames($, dir, 'dir')) {
    const text = await $.fs.read(`${dir}/${name}/SKILL.md`).catch(() => undefined)
    if (typeof text !== 'string') continue
    const { data, body } = parseFrontmatter(text)
    const skillName = typeof data.name === 'string' && data.name ? data.name : name
    skills.set(skillName, {
      name: skillName,
      dir: `${dir}/${name}`,
      description: typeof data.description === 'string' ? data.description : '',
      body,
      modelInvocable: data['disable-model-invocation'] !== true,
      userInvocable: data['user-invocable'] !== false,
    })
  }
  return skills
}
