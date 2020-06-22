import { spawn } from 'child_process'
import { eachLimit } from './util/index.js'

export async function run (test, root) {
  spawn('node', [test], {
    cwd: root,
    stdio: ['pipe', process.stdout, process.stderr]
  }).on('close', msg => {
    if (msg === 1) { console.error('\x1b[31m%s\x1b[0m %s', 'ERR', 'Test failed!') }
  }).on('error', err => {
    console.error(err)
  })
}

export async function runAll (tests, max, root) {
  await eachLimit(tests, max, function (test) {
    spawn('node', [test], {
      cwd: root,
      stdio: ['pipe', process.stdout, process.stderr]
    }).on('close', msg => {
      if (msg === 1) { process.exitCode = 1 }
    }).on('error', err => {
      console.error(err)
    })
  })
}
