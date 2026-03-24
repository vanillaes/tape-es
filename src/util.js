import { spawn } from 'node:child_process'
import { glob } from 'node:fs/promises'

/**
 * Description
 * @param {string} pattern glob pattern(s) to match
 * @param {string} root root path where the matcher runs from
 * @param {string} ignore glob of pattern(s) to ignore
 * @returns {Promise<string[]>} an array of paths
 */
export async function match (pattern, root, ignore) {
  const patterns = pattern.includes(',') ? pattern.split(',') : [pattern]
  const ignores = ignore.includes(',') ? ignore.split(',') : [ignore]

  return await Array.fromAsync(glob(patterns, { cwd: root, exclude: ignores }))
}

/**
 * Run 'spawn' asynchronously
 * @param {string} command the command to run
 * @param {string[]} args an array of arguments
 * @param {string} root the root directory to run the commands
 */
export function spawnAsync (command, args, root) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root })

    let stdoutData = ''
    let stderrData = ''

    child.stdout.on('data', (data) => {
      stdoutData += data.toString()
    })
    child.stderr.on('data', (data) => {
      stderrData += data.toString()
    })
    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout: stdoutData, stderr: stderrData })
      } else {
        reject(new Error(`Process exited with code ${code}: ${stderrData}`))
      }
    })
    child.on('error', (err) => {
      reject(err)
    })
  })
}
