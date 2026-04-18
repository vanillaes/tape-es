/* @ts-self-types="./index.d.ts" */
import { spawn } from 'node:child_process'

/**
 * Run a single test file
 * @param {string} test Path to the test file
 * @param {string} cwd Current working directory
 */
export async function run (test, cwd) {
  const child = spawn('node', [test], { cwd, stdio: ['pipe', process.stdout, process.stderr] })

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
 * @param {Array<string>} tests Path(s) to the test file(s)
 * @param {string} cwd Current working directory
 */
export async function runAll (tests, cwd) {
  let fail = false
  for (const test of tests) {
    try {
      const { stdout, stderr, code } = await spawnTapeAsync('node', [test], cwd)
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

/**
 * Run 'spawn' asynchronously
 * @private
 * @param {string} command Command to run
 * @param {string[]} args Arguments
 * @param {string} cwd Current working directory
 * @returns {Promise<{code: number, stdout: string, stderr: string}>} Process exit code
 */
function spawnTapeAsync (command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd })

    let stdoutData = ''
    let stderrData = ''

    child.stdout.on('data', (data) => {
      stdoutData += data.toString()
    })

    child.stderr.on('data', (data) => {
      data = data.toString()
      // VSCode debug dumps to stderr for some reason, ignore it
      if (data === 'Debugger attached.\n' || data === 'Waiting for the debugger to disconnect...\n') {
        return
      }
      stderrData += data
    })

    // handle errors
    child.on('error', (error) => {
      reject(new Error(error.message))
    })

    // forward the error code
    child.on('close', (/** @type {number} */ code) => {
      resolve({ stdout: stdoutData, stderr: stderrData, code })
    })
  })
}
