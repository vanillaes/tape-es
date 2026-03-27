import { match, run } from '../../src/index.js'
import { watch } from 'chokidar'

/**
 * Watch test files and run a test when it changes
 * @param {string} pattern the pattern used to locate the test files
 * @param {object} options test options
 */
export async function testWatch (pattern, options) {
  const tests = await match(pattern, options?.cwd, options?.ignore)
  const watcher = watch(tests, {
    persistent: true,
    ignoreInitial: true,
    cwd: options?.cwd,
    depth: 99
  })
  watcher.on('all', (_, path) => run(path, options?.cwd))
}
