import { spawn } from 'node:child_process'

/**
 * Run 'spawn' asynchronously
 * @param {string} command the command to run
 * @param {string[]} args an array of arguments
 * @param {string} cwd the current working directory
 * @returns {Promise<{code: number, stdout: string, stderr: string}>} returns a promise that spawns a test
 */
export function spawnAsync (command, args, cwd) {
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
