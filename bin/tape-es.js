#!/usr/bin/env node
import { testAll, testWatch } from './commands/index.js'
import { createRequire } from 'node:module'
import { Command } from 'commander'
const require = createRequire(import.meta.url)
const pkg = require('../package.json')

const program = new Command()
  .name('tape-es')
  .description('Tape-ES Test Framework (ECMAScript Compatible Version)')
  .version(pkg.version, '-v, --version')

program.argument('[pattern]', 'Glob pattern', '**/*.spec.js')
  .description('Test files matching the provided pattern (default *.spec.js)')
  .usage('[--watch] [...options] pattern', false)
  .option('--watch', 'Watch for changes to tests', false)
  .option('--ignore [ignore]', 'Ignore files pattern', '**/node_modules/**')
  .option('--cwd [cwd]', 'The current working directory', process.cwd())
  .action((pattern, options) => {
    if (!options?.watch) {
      testAll(pattern, options)
    }

    if (options?.watch) {
      testWatch(pattern, options)
    }
  })

program.parse(process.argv)
