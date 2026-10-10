const { test } = require('node:test');
const assert = require('node:assert/strict');
const { build, canFallThrough } = require('../switch-core.js');
const native = require('./native-program.cjs');
const languages = ['c', 'cpp', 'python', 'java', 'javascript', 'csharp'];
test('switch selects a numbered case, default or no branch and continues afterward', () => {
  for (const language of languages) {
    assert.equal(build({ language, choice: 1 }).output, 'Start\nAfter selection\n');
    assert.equal(build({ language, choice: 2 }).output, 'Help\nAfter selection\n');
    assert.equal(build({ language, choice: 3 }).output, 'Unknown choice\nAfter selection\n');
    const missing = build({ language, choice: 0, includeDefault: false });
    assert.equal(missing.selected, 'No match');
    assert.equal(missing.output, 'After selection\n');
    assert.deepEqual(missing.states.map(s => s.phase), ['ready', 'initialize', 'dispatch', 'after', 'terminate']);
    const m = build({ language });
    assert.equal(m.states.at(-1).output, m.output);
    assert.equal(m.states[0].output, '');
    assert.ok(m.states.filter(s => s.line !== null).every(s => s.line >= 0 && s.line < m.code.split('\n').length));
  }
});
test('fall-through preserves the original match and ends at the next break', () => {
  for (const language of languages) {
    if (!canFallThrough(language)) { assert.throws(() => build({ language, breakAfterFirst: false }), /fall-through/); continue; }
    const m = build({ language, choice: 1, breakAfterFirst: false });
    assert.equal(m.selected, 'case 1');
    assert.equal(m.output, 'Start\nHelp\nAfter selection\n');
    assert.deepEqual(m.states.map(s => s.phase), ['ready', 'initialize', 'dispatch', 'body', 'fallthrough', 'body', 'break', 'after', 'terminate']);
    assert.equal(m.states[3].output, 'Start\n');
    assert.equal(m.states[5].active, 'case 2');
    assert.ok(!m.output.includes('Unknown'));
  }
});
test('switch model validates bounded inputs', () => {
  for (const args of [{ choice: -1 }, { choice: 4 }, { choice: 1.5 }, { language: 'unknown' }, { includeDefault: 'false' }]) assert.throws(() => build(args), RangeError);
});
for (const language of languages) test(`switch ${language} source matches simulation output`, { timeout: 180000 }, t => {
  const available = native.available(language);
  if (!available) return t.skip(`${language} compiler/runtime is unavailable`);
  const variants = [{ choice: 1 }, { choice: 2 }, { choice: 0 }, { choice: 3, includeDefault: false }];
  if (canFallThrough(language)) variants.push({ choice: 1, breakAfterFirst: false });
  for (const config of variants) {
    const m = build({ language, ...config });
    assert.equal(native.execute(language, m.code, available), m.output);
  }
});
