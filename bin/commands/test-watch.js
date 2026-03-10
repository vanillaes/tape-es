import { match, run } from '../../src/index.js'
import { watch } from 'chokidar'

export async function testWatch (pattern, options) {
  const tests = await match(pattern, options?.root, options?.ignore)
  const watcher = watch(tests, {
    persistent: true,
    ignoreInitial: true,
    cwd: options?.root,
    depth: 99
  })
  watcher.on('all', (_, path) => run(path, options?.root))
}
