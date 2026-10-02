import { expect, test } from 'claude-code/testing'
import { cleanTitle } from '../hooks/lib.ts'

test('a title becomes one line with single spaces', async () => {
  expect(cleanTitle('  [FIX]   broken\n UI  ')).toBe('[FIX] broken UI')
})

test('an empty or missing title gives no title', async () => {
  expect(cleanTitle('   \n ')).toBe(undefined)
  expect(cleanTitle(undefined)).toBe(undefined)
  expect(cleanTitle(42)).toBe(undefined)
})
