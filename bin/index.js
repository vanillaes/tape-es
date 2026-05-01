#!/usr/bin/env node
import { run, runAll, TapeConfig } from '../src/index.js'
import { matchAll, Package } from '@vanillaes/esmtk'
import { watch } from 'chokidar'
import { Command } from 'commander'

const DEFAULT_FILES = [
  '**/*.spec.js'
]

const DEFAULT_IGNORE = [
  'node_modules/'
]

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
export async function testAll (pattern = '', options = {}) {
  const {
    cwd = process.cwd(),
    ignore = ''
  } = options

  const { files, exclude } = consolidateConfig(pattern, ignore, cwd)

  const tests = await matchAll(files, cwd, exclude)
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

  const { files, exclude } = consolidateConfig(pattern, ignore, cwd)

  const tests = await matchAll(files, cwd, exclude)
  const watcher = watch(tests, {
    persistent: true,
    ignoreInitial: true,
    cwd,
    depth: 99
  })
  watcher.on('all', (_, path) => run(path, cwd))
}

/**
 * Consiolidate the configurations (input, config, defaults)
 * @private
 * @param {string} pattern Pattern(s) used to locate the test files
 * @param {string} ignore Pattern(s) used to ignore
 * @param {string} cwd Current working directory
 * @returns {{files: string[], exclude: string[]}} an object containing (files, exclude)
 */
function consolidateConfig (pattern, ignore, cwd) {
  // extract config from package.json
  const config = new TapeConfig(cwd)

  // consolidate file pattern(s)
  /** @type {string[]} */
  let files = []
  if (config.files) {
    files = config.files
  }
  if (pattern) {
    files = pattern.includes(',') ? pattern.split(',') : [pattern]
  }
  if (files.length === 0) {
    files = DEFAULT_FILES
  }
  files = [...new Set(files)]

  // consolidate ignore pattern(s)
  let exclude = [...DEFAULT_IGNORE]
  if (config.ignore) {
    exclude = config.ignore
  }
  if (ignore) {
    exclude = ignore.includes(',') ? ignore.split(',') : [ignore]
  }
  exclude = [...exclude, ...DEFAULT_IGNORE]
  exclude = [...new Set(exclude)]

  return { files, exclude }
}
