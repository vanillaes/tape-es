import { run } from '../../src/index.js'
import { match } from '@vanillaes/esmtk'
import { watch } from 'chokidar'

/**
 * @typedef Options
 * @property {string} cwd the current working directory
 * @property {string} ignore Ignore files pattern
 */

/**
 * Watch test files and run a test when it changes
 * @private
 * @param {string} pattern the pattern used to locate the test files
 * @param {Options} options test options
 */
export async function testWatch (pattern, options) {
  const tests = await match(pattern, options?.cwd, options?.ignore)
  const watcher = watch(tests, {
    persistent: true,
    ignoreInitial: true,
    cwd: options?.cwd,
    depth: 99
  })
  watcher.on('all', (_, path) => run(path, options.cwd))
}
