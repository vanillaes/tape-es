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
export async function testAll (pattern, options = {}) {
  const {
    cwd = process.cwd(),
    ignore
  } = options

  // extract config from package.json
  const config = new TapeConfig(cwd)

  // consolidate file pattern(s)
  let patterns = [...DEFAULT_FILES]
  if (pattern) {
    const inputPatterns = pattern.includes(',') ? pattern.split(',') : [pattern]
    patterns = [...patterns, ...inputPatterns]
  }
  if (config.files) {
    patterns = [...patterns, ...config.files]
  }
  patterns = [...new Set(patterns)]

  // consolidate ignore pattern(s)
  let exclude = [...DEFAULT_IGNORE]
  if (ignore) {
    const inputExclude = ignore.includes(',') ? ignore.split(',') : [ignore]
    exclude = [...exclude, ...inputExclude]
  }
  if (config.ignore) {
    exclude = [...exclude, ...config.ignore]
  }
  exclude = [...new Set(exclude)]

  const tests = await matchAll(patterns, cwd, exclude)
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

  // extract config from package.json
  const config = new TapeConfig(cwd)

  // consolidate file pattern(s)
  let patterns = [...DEFAULT_FILES]
  if (pattern) {
    const inputPatterns = pattern.includes(',') ? pattern.split(',') : [pattern]
    patterns = [...patterns, ...inputPatterns]
  }
  if (config.files) {
    patterns = [...patterns, ...config.files]
  }
  patterns = [...new Set(patterns)]

  // consolidate ignore pattern(s)
  let exclude = [...DEFAULT_IGNORE]
  if (ignore) {
    const inputExclude = ignore.includes(',') ? ignore.split(',') : [ignore]
    exclude = [...exclude, ...inputExclude]
  }
  if (config.ignore) {
    exclude = [...exclude, ...config.ignore]
  }
  exclude = [...new Set(exclude)]

  const tests = await matchAll(patterns, cwd, exclude)
  const watcher = watch(tests, {
    persistent: true,
    ignoreInitial: true,
    cwd,
    depth: 99
  })
  watcher.on('all', (_, path) => run(path, cwd))
}
