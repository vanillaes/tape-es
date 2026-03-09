import { glob } from 'node:fs/promises'

export async function eachLimit (items, limit, fn) {
  Promise.all([...Array(limit)].map(async () => {
    while (items.length > 0) {
      await fn(items.pop())
    }
  }))
}

export async function match (pattern, root, ignore) {
  // multiple ignore patterns
  if (ignore.includes(',')) {
    ignore = ignore.split(',')
  }

  return await Array.fromAsync(glob(pattern, { cwd: root, exclude: [ignore] }))
}
