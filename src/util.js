import glob from 'glob'
import { promisify } from 'util'
const globAsync = promisify(glob)

export async function eachLimit (items, limit, fn) {
  Promise.all([...Array(limit)].map(async () => {
    while (items.length > 0) {
      await fn(items.pop())
    }
  }))
}

export async function match (pattern, ignore, root) {
  // multiple ignore patterns
  if (ignore.includes(',')) {
    ignore = ignore.split(',')
  }
  return globAsync(pattern, { cwd: root, ignore })
}
