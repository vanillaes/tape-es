import glob from 'glob'
import { promisify } from 'util'
const globAsync = promisify(glob)

export async function match (pattern, ignore, root) {
  // multiple ignore patterns
  if (ignore.includes(',')) {
    ignore = ignore.split(',')
  }
  return globAsync(pattern, { cwd: root, ignore })
}
