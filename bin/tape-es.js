#!/usr/bin/env node
import { match, runAll } from '../src/index.js'
import { createRequire } from 'node:module'
import cli from 'commander'
const require = createRequire(import.meta.url)
const pkg = require('../package.json')

const DEFAULT_PATTERN = '**/*.spec.js'
const DEFAULT_IGNORE = '**/node_modules/**'
const DEFAULT_ROOT = process.cwd()
const DEFAULT_THREADS = 10;

(async () => {
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
