import { stat, readFile } from 'fs';
import { promisify } from 'util';
const fileStatAsync = promisify(stat);
const readFileAsync = promisify(readFile);

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
