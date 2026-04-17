#!/usr/bin/env node
import { run, runAll } from '../src/index.js'
import { match, Package } from '@vanillaes/esmtk'
import { watch } from 'chokidar'
import { Command } from 'commander'

const pkg = new Package()
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

/**
 * Run all tests matching the provided pattern
 * @private
 * @param {string} pattern the pattern to locate the test files
 * @param {object} options 'test' options
 * @param {string} options.cwd the current working directory
 * @param {string} options.ignore Ignore files pattern
 */
export async function testAll (pattern, options) {
  const tests = await match(pattern, options.cwd, options.ignore)
  await runAll(tests, options?.cwd)
}

/**
 * Watch test files and run a test when it changes
 * @private
 * @param {string} pattern the pattern used to locate the test files
 * @param {object} options test options
 * @param {string} options.cwd the current working directory
 * @param {string} options.ignore Ignore files pattern
 */
export async function testWatch (pattern, options) {
  const tests = await match(pattern, options?.cwd, options?.ignore)
  const watcher = watch(tests, {
    persistent: true,
    ignoreInitial: true,
    cwd: options?.cwd,
    depth: 99
  })
  watcher.on('all', (_, path) => run(path, options.cwd))
}
