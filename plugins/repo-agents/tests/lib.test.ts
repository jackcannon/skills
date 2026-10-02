import { expect, test } from 'claude-code/testing'
import { globsOf, listingLine, matchesAny, parseFrontmatter, relativeTo } from '../hooks/lib.ts'

test('parses scalars, booleans, folded text and lists', async () => {
  const { data, body } = parseFrontmatter(
    '---\nname: demo\ndescription: >-\n  One line\n  and more.\ndisable-model-invocation: true\npaths:\n  - "src/**/*.ts"\n  - lib/*.js\n---\n\n# Body\n',
  )
  expect(data.name).toBe('demo')
  expect(data.description).toBe('One line and more.')
  expect(data['disable-model-invocation']).toBe(true)
  expect(globsOf(data)).toEqual(['src/**/*.ts', 'lib/*.js'])
  expect(body.trim()).toBe('# Body')
})

test('a file with no frontmatter is all body, and loads every session', async () => {
  const { data, body } = parseFrontmatter('# Just text\n')
  expect(globsOf(data)).toEqual([])
  expect(body).toBe('# Just text\n')
})

test('inline lists and comma lists both give globs', async () => {
  expect(globsOf(parseFrontmatter('---\npaths: ["a/**", "b/*.md"]\n---\n').data)).toEqual(['a/**', 'b/*.md'])
  expect(globsOf(parseFrontmatter('---\nglobs: a/**, b/*.md\n---\n').data)).toEqual(['a/**', 'b/*.md'])
})

test('globs match the way rule paths do', async () => {
  expect(matchesAny('src/a/b.ts', ['src/**/*.ts'])).toBe(true)
  expect(matchesAny('src/b.ts', ['src/**/*.ts'])).toBe(true)
  expect(matchesAny('lib/b.ts', ['src/**/*.ts'])).toBe(false)
  expect(matchesAny('a.tsx', ['*.{ts,tsx}'])).toBe(true)
  expect(matchesAny('deep/a.tsx', ['*.{ts,tsx}'])).toBe(false)
  expect(matchesAny('docs/x.md', ['./docs/*.md'])).toBe(true)
})

test('paths outside the root are not relative to it', async () => {
  expect(relativeTo('/r/repo', '/r/repo/src/a.ts')).toBe('src/a.ts')
  expect(relativeTo('/r/repo/', '/r/repo/a.ts')).toBe('a.ts')
  expect(relativeTo('/r/repo', '/r/repo2/a.ts')).toBe(undefined)
})

test('a listing line is one line', async () => {
  expect(listingLine('x', 'Two\n  lines.')).toBe('- x: Two lines.')
})
