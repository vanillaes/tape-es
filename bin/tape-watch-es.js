#!/usr/bin/env node
import cli from 'commander'
import chokidar from 'chokidar'
import { run } from '../src/runners.js'
import { readPkg } from '../src/util/index.js'

const DEFAULT_PATTERN = '**/*.spec.js'
const DEFAULT_IGNORE = '**/node_modules/**'
const DEFAULT_ROOT = process.cwd();

(async () => {
  const pkg = await readPkg()

  cli.version(pkg.version)
    .arguments('[pattern]')
    .option('-i, --ignore [value]', 'Ignore files pattern')
    .option('-r, --root [value]', 'The root path')
    .parse(process.argv)

  const pattern = cli.pattern ? cli.pattern : DEFAULT_PATTERN
  const ignore = cli.ignore ? cli.ignore : DEFAULT_IGNORE
  const root = cli.root ? cli.root : DEFAULT_ROOT

  const watcher = chokidar.watch(pattern, {
    ignored: [ignore],
    persistent: true,
    ignoreInitial: true,
    cwd: root
  })
  watcher.on('all', (event, path, stat) => run(path, root))
})().catch(e => {
  console.error(e)
})
