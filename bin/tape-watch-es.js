#!/usr/bin/env node
import { run } from '../src/runners.js'
import { readPkg } from '../src/util/index.js'
import { glob } from 'node:fs/promises'
import cli from 'commander'
import chokidar from 'chokidar'

const DEFAULT_PATTERN = '**/*.spec.js'
const DEFAULT_IGNORE = 'node_modules/'
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

  const files = await Array.fromAsync(glob(pattern, { cwd: root, exclude: [ignore] }))
  const watcher = chokidar.watch(files, {
    ignored: [ignore],
    persistent: true,
    ignoreInitial: true,
    cwd: root,
    depth: 99
  })
  watcher.on('all', (event, path, stat) => run(path, root))
})().catch(e => {
  console.error(e)
})
