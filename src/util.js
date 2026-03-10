import { glob } from 'node:fs/promises'

/**
 * Execute a function for each item but limit the total runnning at once
 * @param {string[]} items the items to be acted on
 * @param {number} limit the total number of threads to run at once
 * @param {function} fn the function to apply to each item
 */
export async function eachLimit (items, limit, fn) {
  Promise.all([...Array(limit)].map(async () => {
    while (items.length > 0) {
      await fn(items.pop())
    }
  }))
}

/**
 * Description
 * @param {string} pattern glob pattern(s) to match
 * @param {string} root root path where the matcher runs from
 * @param {string} ignore glob of pattern(s) to ignore
 */
export async function match (pattern, root, ignore) {
  const patterns = pattern.includes(',') ? [pattern] : pattern.split(',')
  const ignores = ignore.includes(',') ? [ignore] : ignore.split(',')

  return await Array.fromAsync(glob(patterns, { cwd: root, exclude: ignores }))
}
