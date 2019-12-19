import { join } from 'path';

export const pkgPath = join(new URL(import.meta.url).pathname, '../../../package.json');
