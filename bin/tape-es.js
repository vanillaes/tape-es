#!/usr/bin/env node
import { run, runAll } from '../src/index.js'
import { match, Package } from '@vanillaes/esmtk'
import { watch } from 'chokidar'
import { Command } from 'commander'

const pkg = new Package()
const program = new Command()
  .name('tape-es')
  .version(pkg?.version || '', '-v, --version')
  .usage('[...options] [files]')
  .description('Tape-ES Test Framework (ECMAScript Compatible Version)')
  .argument('[files]', 'File(s)/glob(s) to test (default: **/*.spec.js')
  .option('--cwd [cwd]', 'Current working directory')
  .option('--ignore [ignore]', 'Files(s)/glob(s) to ignore (default: **/node_modules/**')
  .option('--watch', 'Watch for changes')
  .action((files, options) => {
    if (!options?.watch) {
      testAll(files, options)
    }

    if (options?.watch) {
      testWatch(files, options)
    }
  })

program.parse(process.argv)

/**
 * Run all tests matching the provided pattern
 * @private
 * @param {string} [pattern] Pattern(s) used to locate the test files
 * @param {object} [options] 'test' options
 * @param {string} [options.cwd] Current working directory
 * @param {string} [options.ignore] Ignore pattern(s)
 */
export async function testAll (pattern = '**/*.spec.js', options = {}) {
  const {
    cwd = process.cwd(),
    ignore = '**/node_modules/**'
  } = options

  const tests = await match(pattern, cwd, ignore)
  await runAll(tests, cwd)
}

/**
 * Watch test files and run a test when it changes
 * @private
 * @param {string} [pattern] Pattern(s) used to locate the test files
 * @param {object} [options] 'test' options
 * @param {string} [options.cwd] Current working directory
 * @param {string} [options.ignore] Ignore pattern(s)
 */
export async function testWatch (pattern = '**/*.spec.js', options = {}) {
  const {
    cwd = process.cwd(),
    ignore = '**/node_modules/**'
  } = options

  const tests = await match(pattern, cwd, ignore)
  const watcher = watch(tests, {
    persistent: true,
    ignoreInitial: true,
    cwd,
    depth: 99
  })
  watcher.on('all', (_, path) => run(path, cwd))
}
