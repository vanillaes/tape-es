import { spawnAsync } from './index.js'
import { spawn } from 'node:child_process'

/**
 * Run a single test file
 * @param {string} test path to the test file
 * @param {string} cwd the current working directory
 */
export async function run (test, cwd) {
  const child = spawn('node', [test], {
    cwd,
    stdio: ['pipe', process.stdout, process.stderr]
  })

  // handle errors
  child.on('error', error => {
    console.error(error)
    process.exitCode = 1
  })

  child.on('close', (/** @type {number} */ code) => {
    if (code === 1) {
      console.error('\x1b[31m%s\x1b[0m %s', 'ERR', 'Test failed!')
    }
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
      const { stdout, stderr, code } = await spawnAsync('node', [test], cwd)
      if (code === 0) {
        console.log(stdout)
      } else {
        if (stdout) {
          fail = true
          console.log(stdout)
        }
        if (stderr) {
          console.error(stderr)
          process.exitCode = 1
          return
        }
      }
    } catch (error) {
      fail = true
      if (error instanceof Error) {
        console.log(error.message)
      } else {
        console.error(`Unexpected error: ${error}`)
      }
      process.exitCode = 1
      return
    }
  }
  if (fail) {
    process.exitCode = 1
  }
}
