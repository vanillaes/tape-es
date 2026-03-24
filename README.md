<h1 align="center">Tape-ES</h1>

A **[Tape.js][]** test runner and watcher for modern JavaScript. Works with both ES modules and CommonJS.

<div align="center">
  <a href="https://github.com/vanillaes/tape-es/releases"><img src="https://badgen.net/github/tag/vanillaes/tape-es?cache-control=no-cache" alt="GitHub Release"></a>
  <a href="https://www.npmjs.com/package/@vanillaes/tape-es"><img src="https://badgen.net/npm/v/@vanillaes/tape-es?icon=npm" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/@vanillaes/tape-es"><img src="https://badgen.net/npm/dm/@vanillaes/tape-es?icon=npm" alt="NPM Downloads"></a>
  <a href="https://github.com/vanillaes/tape-es/actions"><img src="https://github.com/vanillaes/tape-es/workflows/Latest/badge.svg" alt="Latest Status"></a>
  <a href="https://github.com/vanillaes/tape-es/actions"><img src="https://github.com/vanillaes/tape-es/workflows/Release/badge.svg" alt="Release Status"></a>
</div>

## Features

- runs ES module tests
- uses sensible defaults
- works with `type: module` packages

## tape-es

### Arguments

`tape-es [pattern] -i [pattern] -r [path] -t [number]`

- `[pattern]` - the file matcher pattern (default `**/*.spec.js`)
- `--watch` - watch the tests for changes
- `-i` | `--ignore` - the ignore matcher pattern (default `**/node_modules/**`)
- `-r` | `--root` - the root path to run the tests from (default `process.cwd()`)

### Basic Usage

Use the defaults

```sh
tape-es
```

### Advanced Usage

Specify custom parameters

```sh
tape-es "**/*.spec.js" -i "node_modules/**" -r ../absurdum/
```

**Note: In Linux/OSX the matcher patterns must be delimited in quotes.**

## Writing Tests

Tests are identical to Tape.js, except `import` is used to load modules rather than require.

```javascript
import test from 'tape';
import { arrays } from '../../index.js';

test('arrays.chunk(array) - should return a chunk for each item in the array', t => {
  // ...test code
});
```

## Tap Reporters

One of the greatest advantages to using Tape, is that it outputs results in the standard [TAP][] format. That means you can pipe the results into a wide array of TAP reporters.

The parallel nature of this runner will break most reporters. As a General rule.

1. if you want speed (ie CI/CD) don't use a reporter
2. if you want speed and readability use [tap-spec][]
3. if you want to use any reporter, run tests in parallel with `tape-es -t 1`

[Tape.js]: https://github.com/substack/tape
[TAP]: https://en.wikipedia.org/wiki/Test_Anything_Protocol
[tap-spec]: https://github.com/scottcorgan/tap-spec
