# Tape-ES

A Tape.js test runner for ES modules

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