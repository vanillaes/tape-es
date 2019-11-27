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

```sh
tape-es
```

This package comes w/ sensible defaults

- the current directory is used as the root
- it matches all files that match `*.spec.js`
- `node_modules` is excluded from matching
- tests run on 10 concurrent threads

## Advanced Usage

All of these defaults can be overridden

`tape-es [pattern] -i [ignore_pattern] -r [root_directory] -t [threads]`

For example...

```sh
tape-es **/*.spec.js -i node_modules/** -r ../absurdum/ -t 20
```

## Writing Tests

Tests are identical to Tape.js, except `import` is used to load modules rather than require.

```javascript
import test from 'tape';
import { arrays } from '../../index.js';

test('arrays.chunk(array) - should return a chunk for each item in the array', t => {
  const expect = [[1], [2], [3], [4]];
  const result = arrays.chunk([1, 2, 3, 4]);

  t.equal(Object.prototype.toString.call(result), '[object Array]', 'return type');
  t.equal(result.length, 4, 'output length');
  t.deepEqual(result, expect, 'output value');

  t.end();
});
```

[Tape.js]: https://github.com/substack/tape