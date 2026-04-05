/**
 * Description
 * @param {string} pattern glob pattern(s) to match
 * @param {string} cwd the current working directory
 * @param {string} ignore glob of pattern(s) to ignore
 * @returns {Promise<string[]>} an array of paths
 */
export function match(pattern: string, cwd: string, ignore: string): Promise<string[]>;
/**
 * Run 'spawn' asynchronously
 * @param {string} command the command to run
 * @param {string[]} args an array of arguments
 * @param {string} cwd the current working directory
 * @returns {Promise<{code: number, stdout: string, stderr: string}>} returns a promise that spawns a test
 */
export function spawnAsync(command: string, args: string[], cwd: string): Promise<{
    code: number;
    stdout: string;
    stderr: string;
}>;
