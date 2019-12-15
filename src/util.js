import { stat, readFile } from 'fs';
import { promisify } from 'util';
import glob from 'glob';
const fileStatAsync = promisify(stat);
const readFileAsync = promisify(readFile);
const globAsync = promisify(glob);

export async function readPkg (path) {
  if (!await fileStatAsync(path)) {
    throw Error('ERR_CONFIG: package.json not found, is this a package?');
  }

  try {
    return JSON.parse(await readFileAsync(path, 'utf-8'));
  } catch {
    throw Error('ERR_CONFIG: Failed to read package.json');
  }
}

export async function match (pattern, ignore, root) {
  // multiple ignore patterns
  if (ignore.includes(',')) {
    ignore = ignore.split(',');
  }
  return globAsync(pattern, { cwd: root, ignore });
}

export async function eachLimit (items, limit, fn) {
  Promise.all([...Array(limit)].map(async () => {
    while (items.length > 0) {
      await fn(items.pop());
    }
  }));
}
