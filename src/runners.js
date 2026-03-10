import { spawn } from 'child_process'
import { eachLimit } from './index.js'

/**
 * Run a single test file
 * @param {string} test path to the test file
 * @param {any} root root path where the test is based
 */
export async function run (test, root) {
  spawn('node', [test], {
    cwd: root,
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
 * @param {any} max maximum number of threads to execute in parallel
 * @param {any} root root path where the test is based
 */
export async function runAll (tests, max, root) {
  await eachLimit(tests, max, function (test) {
    spawn('node', [test], {
      cwd: root,
      stdio: ['pipe', process.stdout, process.stderr]
    }).on('close', msg => {
      if (msg === 1) { process.exitCode = 1 }
    }).on('error', err => {
      console.error(err)
    })
  })
}
