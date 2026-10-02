// Pure helpers for rename-chat. No `$` here, so the tests can run them directly.

/** The title as one line with single spaces, or undefined when nothing is left. */
export function cleanTitle(raw: unknown): string | undefined {
  if (typeof raw !== 'string') return undefined
  const title = raw.replace(/\s+/g, ' ').trim()
  return title || undefined
}
