const { test } = require('node:test');
const assert = require('node:assert/strict');
const A = require('../arrays-core.js');
test('array initialization distinguishes partial zero-fill from unknown local values', () => {
  assert.deepEqual(A.createValues(), [4, 8, 12, 16, 20]);
  assert.deepEqual(A.createValues(5, [4, 8]), [4, 8, 0, 0, 0]);
  assert.deepEqual(A.createValues(3, []), [0, 0, 0]);
  const unknown = A.createValues(5, null);
  assert.deepEqual(unknown, [null, null, null, null, null]);
  assert.throws(() => A.read(unknown, 0), /uninitialized/);
  assert.throws(() => A.traversalTrace(unknown), /uninitialized/);
  const assigned = A.write(unknown, 0, 42);
  assert.equal(A.read(assigned, 0), 42);
  assert.equal(unknown[0], null);
  assert.throws(() => A.createValues(2, [1, 2, 3]), RangeError);
  assert.throws(() => A.createValues(0, []), RangeError);
  assert.throws(() => A.createValues(5, [1.2]), RangeError);
  assert.throws(() => A.createValues(5, Array(2)), RangeError);
  assert.throws(() => A.read(Array(5), 0), RangeError);
});
test('array reads and writes check both boundaries without changing the stored values', () => {
  const values = A.createValues();
  assert.equal(A.read(values, 0), 4); assert.equal(A.read(values, 4), 20);
  assert.deepEqual(A.write(values, 2, 99), [4, 8, 99, 16, 20]);
  assert.deepEqual(values, [4, 8, 12, 16, 20]);
  for (const index of [-1, 5, 1.5, NaN]) {
    assert.throws(() => A.read(values, index), RangeError);
    assert.throws(() => A.write(values, index, 3), RangeError);
  }
  for (const value of [101, -101, NaN, 1.5]) assert.throws(() => A.write(values, 0, value), RangeError);
});
test('forward and reverse traces stop before any invalid read and retain previous output', () => {
  const values = A.createValues();
  for (const reverse of [false, true]) {
    const trace = A.traversalTrace(values, reverse);
    assert.equal(trace[0].phase, 'ready'); assert.equal(trace[1].phase, 'initialize');
    assert.equal(trace.at(-1).phase, 'terminate');
    assert.equal(trace.at(-1).iterations, 5);
    assert.equal(trace.at(-2).condition, false);
    assert.equal(trace.at(-2).index, reverse ? -1 : 5);
    assert.deepEqual(trace.filter(s => s.phase === 'read').map(s => s.activeIndex), reverse ? [4, 3, 2, 1, 0] : [0, 1, 2, 3, 4]);
    assert.equal(trace[3].output, reverse ? '20\n' : '4\n');
    assert.equal(trace.at(-1).output, (reverse ? values.slice().reverse() : values).join('\n') + '\n');
  }
  assert.equal(A.traversalTrace([0], true).at(-1).output, '0\n');
});
