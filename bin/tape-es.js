#!/usr/bin/env node
import { testAll, testWatch } from './commands/index.js'
import { createRequire } from 'node:module'
import { Command } from 'commander'
const require = createRequire(import.meta.url)
const pkg = require('../package.json')

const program = new Command()
  .name('tape-es')
  .version(pkg?.version || '', '-v, --version')
  .usage('[...options] [glob]')
  .description('Tape-ES Test Framework (ECMAScript Compatible Version)')
  .argument('[glob]', 'glob(s) used to locate test files', '**/*.spec.js')
  .option('--cwd [cwd]', 'current working directory', process.cwd())
  .option('--ignore [ignore]', 'glob(s) to ignore', '**/node_modules/**')
  .option('--watch', 'watch for changes to tests')
  .action((glob, options) => {
    if (!options?.watch) {
      testAll(glob, options)
    }

    if (options?.watch) {
      testWatch(glob, options)
    }
  })

program.parse(process.argv)
