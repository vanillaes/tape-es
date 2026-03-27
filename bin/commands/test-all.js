import { match, runAll } from '../../src/index.js'

/**
 * Run all tests matching the provided pattern
 * @param {string} pattern the pattern to locate the test files
 * @param {object} options test options
 */
export async function testAll (pattern, options) {
  const tests = await match(pattern, options?.cwd, options?.ignore)
  await runAll(tests, options?.cwd)
}
