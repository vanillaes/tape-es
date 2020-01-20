import { promises as fs } from 'fs';
import { join } from 'path';

export async function readPkg () {
  const PKG_PATH = join(new URL(import.meta.url).pathname, '../../../package.json');
  if (!await fs.stat(PKG_PATH)) {
    throw Error('package.json not found, is this a package?');
  }

  try {
    return JSON.parse(await fs.readFile(PKG_PATH, 'utf-8'));
  } catch {
    throw Error('Failed to read package.json');
  }
}
