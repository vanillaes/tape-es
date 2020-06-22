#!/usr/bin/env node
import cli from 'commander'
import { runAll } from '../src/runners.js'
import { match, readPkg } from '../src/util/index.js'

const DEFAULT_PATTERN = '**/*.spec.js'
const DEFAULT_IGNORE = '**/node_modules/**'
const DEFAULT_ROOT = process.cwd()
const DEFAULT_THREADS = 10;

(async () => {
  const pkg = await readPkg()

  cli.version(pkg.version)
    .arguments('[pattern]')
    .option('-i, --ignore [value]', 'Ignore files pattern')
    .option('-r, --root [value]', 'The root path')
    .option('-t, --threads [number]', 'Number of threads to run tests concurrently', parseInt)
    .parse(process.argv)

  const pattern = cli.args[0] ? cli.args[0] : DEFAULT_PATTERN
  const ignore = cli.ignore ? cli.ignore : DEFAULT_IGNORE
  const root = cli.root ? cli.root : DEFAULT_ROOT
  const threads = cli.threads ? cli.threads : DEFAULT_THREADS

  const tests = await match(pattern, ignore, root)
  await runAll(tests, threads, root)
})().catch(e => {
  console.error(e)
})
