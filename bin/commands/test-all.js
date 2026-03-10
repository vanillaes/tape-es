import { match, runAll } from '../../src/index.js'

export async function testAll (pattern, options) {
  const tests = await match(pattern, options?.root, options?.ignore)
  await runAll(tests, options?.threads, options?.root)
}
