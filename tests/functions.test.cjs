const { test } = require('node:test');
const assert = require('node:assert/strict');
const { factorialTrace } = require('../functions-core.js');
const D = require('../functions-data.js');
const native = require('./native-program.cjs');

test('factorial stack handles 0–6, nested frames, base case and returns', () => {
  for (const [n, expected] of [1, 1, 2, 6, 24, 120, 720].entries()) {
    const m = factorialTrace(n);
    assert.equal(m.result, expected);
    assert.equal(m.states[0].phase, 'ready');
    assert.deepEqual(m.states[0].frames, []);
    assert.equal(m.states.at(-1).phase, 'done');
    assert.deepEqual(m.states.at(-1).frames, []);
    const calls = m.states.filter(s => s.phase === 'call');
    assert.equal(calls.length, Math.max(1, n));
    assert.equal(m.states.filter(s => s.phase === 'return').length, calls.length);
    assert.deepEqual(calls.at(-1).frames.map(f => f.n), n === 0 ? [0] : Array.from({ length: n }, (_, i) => n - i));
    assert.equal(m.states.filter(s => s.phase === 'base').length, 1);
    assert.equal(m.states.at(-1).result, expected);
    // Earlier snapshots retain their own status even when later calls mutate frames.
    assert.equal(calls[0].frames[0].status, 'evaluating');
  }
});
test('factorial bounds reject invalid or unsafe lesson inputs', () => {
  for (const n of [-1, 7, 1.5, '5', null, Infinity, NaN]) assert.throws(() => factorialTrace(n), RangeError);
});
for (const language of Object.keys(D.examples)) test(`Functions ${language}: all examples and recursive sum solution run`, { timeout: 180000 }, t => {
  const version = native.available(language);
  if (!version) return t.skip(`${language} compiler/runtime unavailable`);
  for (const [key, example] of Object.entries(D.examples[language])) {
    const output = native.execute(language, example.code, version);
    if (key === 'random') assert.match(output, /^[1-6]\n$/);
    else assert.equal(output, example.output, key);
  }
  const recursion = D.examples[language].recursion.code;
  for (const n of [0, 3, 6]) assert.equal(native.execute(language, recursion.replace('factorial(5)', `factorial(${n})`), version), factorialTrace(n).result + '\n');
  const solution = recursion.replaceAll('factorial', 'sumTo').replace('n <= 1', 'n <= 0').replace('return 1', 'return 0').replace('n * sumTo', 'n + sumTo');
  assert.equal(native.execute(language, solution, version), '15\n');
  assert.equal(native.execute(language, solution.replace('sumTo(5)', 'sumTo(0)'), version), '0\n');
});
