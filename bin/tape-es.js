#!/usr/bin/env node
import { testAll, testWatch } from './commands/index.js'
import { createRequire } from 'node:module'
import { Command } from 'commander'
const program = new Command()
const require = createRequire(import.meta.url)
const pkg = require('../package.json')

const DEFAULT_PATTERN = '**/*.spec.js'
const DEFAULT_IGNORE = '**/node_modules/**'
const DEFAULT_ROOT = process.cwd()
const DEFAULT_THREADS = 10

program
  .name('tape-es')
  .description('Tape-ES Test Framework (ECMAScript Compatible Version)')

program.version(pkg.version, '-v, --version')

program.argument('[pattern]', 'Glob pattern', DEFAULT_PATTERN)
  .description('Test files matching the provided pattern (default *.spec.js)')
  .usage('[--watch] [-irt] pattern', false)
  .option('--watch', 'Watch for changes to tests', false)
  .option('-i, --ignore [value]', 'Ignore files pattern', DEFAULT_IGNORE)
  .option('-r, --root [value]', 'The root path', DEFAULT_ROOT)
  .option('-t, --threads [number]', 'Number of threads to run tests concurrently', parseInt, DEFAULT_THREADS)
  .action((pattern, options) => {
    if (!options?.watch) {
      testAll(pattern, options)
    }

    if (options?.watch) {
      testWatch(pattern, options)
    }
  })

program.parse(process.argv)
