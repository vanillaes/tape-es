import { runAll } from '../../src/index.js'
import { match } from '@vanillaes/esmtk'

/**
 * @typedef Options
 * @property {string} cwd the current working directory
 * @property {string} ignore Ignore files pattern
 */

/**
 * Run all tests matching the provided pattern
 * @private
 * @param {string} pattern the pattern to locate the test files
 * @param {Options} options 'test' options
 */
export async function testAll (pattern, options) {
  const tests = await match(pattern, options.cwd, options.ignore)
  await runAll(tests, options?.cwd)
}
