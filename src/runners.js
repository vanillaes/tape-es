import { spawnAsync } from './index.js'
import { spawn } from 'node:child_process'

/**
 * Run a single test file
 * @param {string} test path to the test file
 * @param {string} cwd the current working directory
 */
export async function run (test, cwd) {
  spawn('node', [test], {
    cwd,
    stdio: ['pipe', process.stdout, process.stderr]
  }).on('close', msg => {
    if (msg === 1) { console.error('\x1b[31m%s\x1b[0m %s', 'ERR', 'Test failed!') }
  }).on('error', err => {
    console.error(err)
  })
}

/**
 * Run all tests
 * @param {Array<string>} tests paths to the test files
 * @param {string} cwd the current working directory
 */
export async function runAll (tests, cwd) {
  let fail = false
  for (const test of tests) {
    try {
      const result = await spawnAsync('node', [test], cwd)
      console.log(result.stdout)
    } catch (error) {
      fail = true
      if (error instanceof Error) {
        console.log(error.message)
      } else {
        console.error("Unexpected error type:", error)
      }
    }
  }
  if (fail) {
    process.exitCode = 1
  }
}
