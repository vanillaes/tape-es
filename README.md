[![GitHub Releases](https://img.shields.io/github/release/vanillaes/tape-es.svg)](https://github.com/vanillaes/tape-es/releases)
[![NPM Release](https://img.shields.io/npm/v/tape-es.svg)](https://www.npmjs.com/package/tape-es)
[![David](https://img.shields.io/david/vanillaes/tape-es.svg)](https://david-dm.org/vanillaes/tape-es)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/vanillaes/tape-es/master/LICENSE)
[![Release Status](https://github.com/vanillaes/tape-es/workflows/Release/badge.svg)](https://github.com/vanillaes/tape-es/actions)

# Tape-ES

A **[Tape.js][]** test runner for ES modules

- runs ES module tests
- runs tests in parallel for speed
- uses sensible defaults
- works with `type: module` packages

*Note: Since this is an ES package, it requires Node >= v13.2*

## Usage

### Arguments

`tape-es [pattern] -i [pattern] -r [path] -t [number]`

- `[pattern]` - the file matcher pattern (default `**/*.spec.js`)
- `-i` | `--ignore` - the ignore matcher pattern (default `**/node_modules/**`)
- `-r` | `--root` - the root path to run the tests from (default `process.cwd()`)
- `-t` | `--threads` - Number of threads to run concurrently (default `10`)

### Basic Usage

Use the defaults

```sh
tape-es
```

### Advanced Usage

Specify custom parameters

```sh
tape-es "**/*.spec.js" -i "node_modules/**" -r ../absurdum/ -t 20
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
