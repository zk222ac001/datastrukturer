const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { loopTrace } = require('../learning-core.js');
test('C exercise solutions and simulated output agree with GCC execution', t => {
  if (spawnSync('gcc', ['--version']).status !== 0) return t.skip('GCC is not installed');
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'codeviz-c-'));
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync('for-lesson-data.js', 'utf8'), sandbox);
  vm.runInNewContext(fs.readFileSync('arrays-data.js', 'utf8'), sandbox);
  function execute(code) {
    const source = path.join(temp, 'lesson.c'), binary = path.join(temp, process.platform === 'win32' ? 'lesson.exe' : 'lesson');
    fs.writeFileSync(source, code);
    const compiler = spawnSync('gcc', ['-std=c11', '-Wall', '-Wextra', '-Werror', '-pedantic', source, '-o', binary], { encoding: 'utf8' });
    assert.equal(compiler.status, 0, compiler.stderr);
    const run = spawnSync(binary, [], { encoding: 'utf8', timeout: 3000 });
    assert.equal(run.status, 0, run.stderr);
    return run.stdout.replaceAll('\r\n', '\n');
  }
  try {
    for (const exercise of sandbox.window.FOR_LESSON_DATA.exercises) {
      assert.equal(execute(exercise.solution), exercise.expected);
      if (exercise.id === 'sum') assert.equal(execute(exercise.solution.replace('n = 5', 'n = 0')), 'total = 0\n');
    }
    assert.equal(execute(sandbox.window.ARRAYS_DATA.examples.c.code), sandbox.window.ARRAYS_DATA.output);
    for (const exercise of sandbox.window.ARRAYS_DATA.exercises) {
      assert.equal(execute(exercise.solution), exercise.expected);
      if (exercise.id === 'array-sum') assert.equal(execute(exercise.solution.replace('{3, 6, 9, 12, 15}', '{0, 0, 0, 0, 0}')), 'sum = 0\n');
    }
    for (const config of [{ start: 1, end: 5, step: 1 }, { start: 3, end: 1, step: -1 }, { start: 5, end: 1, step: 1 }, { start: -2, end: 2, step: 3 }]) {
      const code = `#include <stdio.h>\nint main(void) { for (int i = ${config.start}; i ${config.step > 0 ? '<=' : '>='} ${config.end}; i += ${config.step}) { printf("%d\\n", i); } return 0; }`;
      assert.equal(execute(code), loopTrace(config).at(-1).output);
    }
  } finally {
    assert.ok(path.resolve(temp).startsWith(path.resolve(os.tmpdir()) + path.sep + 'codeviz-c-'));
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
