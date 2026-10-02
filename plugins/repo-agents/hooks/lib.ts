// Pure helpers for repo-agents. No `$` here, so the tests can run them directly.

export type Frontmatter = Record<string, string | string[] | boolean>

/** Splits a markdown file into its YAML frontmatter (a small subset) and its body. */
export function parseFrontmatter(text: string): { data: Frontmatter; body: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(text)
  if (!m) return { data: {}, body: text }
  const data: Frontmatter = {}
  const lines = (m[1] ?? '').split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const kv = /^([A-Za-z0-9_-]+):[ \t]*(.*)$/.exec(lines[i] ?? '')
    if (!kv) continue
    const key = kv[1] ?? ''
    const value = (kv[2] ?? '').trim()
    // Indented lines that follow belong to this key: a block scalar or a list.
    const block: string[] = []
    for (let next = lines[i + 1]; next !== undefined && (/^[ \t]+\S/.test(next) || next.trim() === ''); next = lines[i + 1]) {
      block.push(next)
      i++
    }
    if (/^[>|][+-]?$/.test(value)) {
      const parts = block.map(l => l.trim())
      data[key] = (value.startsWith('>') ? parts.filter(Boolean).join(' ') : parts.join('\n')).trim()
    } else if (value === '' && block.some(l => /^\s*-\s/.test(l))) {
      data[key] = block.filter(l => /^\s*-\s/.test(l)).map(l => unquote(l.replace(/^\s*-\s+/, '')))
    } else if (/^\[.*\]$/.test(value)) {
      data[key] = splitList(value.slice(1, -1))
    } else if (value === 'true' || value === 'false') {
      data[key] = value === 'true'
    } else {
      data[key] = unquote(value)
    }
  }
  return { data, body: text.slice(m[0].length) }
}

function unquote(s: string): string {
  const t = s.trim()
  if (t.length >= 2 && (t[0] === '"' || t[0] === "'") && t[t.length - 1] === t[0]) return t.slice(1, -1)
  return t
}

function splitList(s: string): string[] {
  return s.split(',').map(unquote).filter(Boolean)
}

/** The `paths` globs of a rule, or none when it loads every session. */
export function globsOf(data: Frontmatter): string[] {
  const p = data.paths ?? data.globs
  if (p === undefined || typeof p === 'boolean') return []
  return (Array.isArray(p) ? p : splitList(p)).filter(Boolean)
}

/** A glob as Claude Code rules spell it: `**`, `*`, `?` and `{a,b}`. */
export function globToRegExp(glob: string): RegExp {
  let re = ''
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i] ?? ''
    if (c === '*' && glob[i + 1] === '*') {
      const slash = glob[i + 2] === '/'
      re += slash ? '(?:.*/)?' : '.*'
      i += slash ? 2 : 1
    } else if (c === '*') re += '[^/]*'
    else if (c === '?') re += '[^/]'
    else if (c === '{') {
      const end = glob.indexOf('}', i)
      if (end < 0) { re += '\\{'; continue }
      re += '(?:' + glob.slice(i + 1, end).split(',').map(escape).join('|') + ')'
      i = end
    } else re += escape(c)
  }
  return new RegExp('^' + re + '$')
}

function escape(s: string): string {
  return s.replace(/[.+^${}()|[\]\\*?]/g, '\\$&')
}

export function matchesAny(relPath: string, globs: readonly string[]): boolean {
  return globs.some(g => globToRegExp(g.replace(/^\.\//, '')).test(relPath))
}

/** `abs` relative to `root`, or undefined when it is outside. */
export function relativeTo(root: string, abs: string): string | undefined {
  const r = root.replace(/\/+$/, '') + '/'
  return abs.startsWith(r) ? abs.slice(r.length) : undefined
}

/** One line of the skill listing, as Claude Code writes its own. */
export function listingLine(name: string, description: string): string {
  return `- ${name}: ${description.replace(/\s+/g, ' ').trim()}`
}
