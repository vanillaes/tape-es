#!/usr/bin/env node
import { match, run } from '../src/index.js'
import { createRequire } from 'node:module'
import cli from 'commander'
import { watch } from 'chokidar'
const require = createRequire(import.meta.url)
const pkg = require('../package.json')

const DEFAULT_PATTERN = '**/*.spec.js'
const DEFAULT_IGNORE = 'node_modules/'
const DEFAULT_ROOT = process.cwd();

(async () => {
  cli.version(pkg.version)
    .arguments('[pattern]')
    .option('-i, --ignore [value]', 'Ignore files pattern')
    .option('-r, --root [value]', 'The root path')
    .parse(process.argv)

  const pattern = cli.pattern ? cli.pattern : DEFAULT_PATTERN
  const ignore = cli.ignore ? cli.ignore : DEFAULT_IGNORE
  const root = cli.root ? cli.root : DEFAULT_ROOT

  const tests = await match(pattern, root, ignore)
  const watcher = watch(tests, {
    ignored: [ignore],
    persistent: true,
    ignoreInitial: true,
    cwd: root,
    depth: 99
  })
  watcher.on('all', (_, path) => run(path, root))
})().catch(e => {
  console.error(e)
})
