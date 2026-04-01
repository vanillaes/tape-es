<h1 align="center">Tape-ES</h1>

<div align="center">📼  A <a href="https://github.com/substack/tape">Tape</a> test runner and watcher for modern JavaScript</div>

<br />

<div align="center">
  <a href="https://github.com/vanillaes/tape-es/releases"><img src="https://badgen.net/github/tag/vanillaes/tape-es?cache-control=no-cache" alt="GitHub Release"></a>
  <a href="https://www.npmjs.com/package/@vanillaes/tape-es"><img src="https://badgen.net/npm/v/@vanillaes/tape-es?icon=npm" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/@vanillaes/tape-es"><img src="https://badgen.net/npm/dm/@vanillaes/tape-es?icon=npm" alt="NPM Downloads"></a>
  <a href="https://github.com/vanillaes/tape-es/actions"><img src="https://github.com/vanillaes/tape-es/workflows/Latest/badge.svg" alt="Latest Status"></a>
  <a href="https://github.com/vanillaes/tape-es/actions"><img src="https://github.com/vanillaes/tape-es/workflows/Release/badge.svg" alt="Release Status"></a>
</div>

## Features

- Runs ECMAScript module tests
- Runs CommonJS tests
- Uses sensible defaults
- Compatible with tap reporters
- Works in CI/CD pipelines

## tape-es

### Arguments

`tape-es [pattern] -i [pattern] -r [path] -t [number]`

- `[pattern]` - the file matcher pattern (default `**/*.spec.js`)
- `--cwd` - the current working directory (default `process.cwd()`)
- `--ignore` - the ignore matcher pattern (default `**/node_modules/**`)
- `--watch` - watch the tests for changes

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

Tests are identical to [Tape][], except `import` is used to load modules (ie not `require`).

```javascript
import test from 'tape'
import { arrays } from '../../index.js'

test('arrays.chunk(array) - should return a chunk for each item in the array', t => {
  // ...test code
})
```

## Tap Reporters

One of the greatest advantages to using Tape, is that it outputs results in the standard [TAP][] format. That means you can pipe the results into a wide array of TAP reporters.

*Recommendation:*

1. if you want speed (ie CI/CD) don't use a reporter
2. if you want readability use [tap-spec][]

```sh
tape-es | tap-spec
```

[Tape]: https://github.com/substack/tape
[TAP]: https://en.wikipedia.org/wiki/Test_Anything_Protocol
[tap-spec]: https://github.com/scottcorgan/tap-spec
