const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildTrace, readCell } = require('../pointers-core.js');
const native = require('./native-program.cjs');

test('pointer aliases mutate the same integer through a copied function parameter', () => {
  const model = buildTrace();
  assert.deepEqual(model.states.map(state => state.phase), ['ready', 'initialize', 'address', 'write', 'call', 'function-write', 'return', 'output', 'done']);
  assert.equal(model.states[1].cells[0].value, 10);
  assert.equal(model.states[2].pointer, '&value');
  assert.equal(readCell(model.states[3]), 20);
  assert.equal(model.states[4].helperPointer, '&value');
  assert.equal(readCell(model.states[5]), 30);
  assert.equal(model.states[6].helperPointer, null);
  assert.equal(model.output, 'value = 30\n');
  assert.equal(model.states.at(-1).output, model.output);
  assert.ok(model.code.includes('static void setValue(int *target)'));
});

test('dynamic allocation checks, initializes, reads and releases storage in order', () => {
  const model = buildTrace({ scenario: 'allocation' });
  assert.deepEqual(model.states.map(state => state.phase), ['ready', 'allocate', 'check', 'initialize', 'initialize', 'initialize', 'sum', 'output', 'free', 'clear', 'done']);
  assert.deepEqual(model.states[1].cells.map(cell => cell.value), [null, null, null]);
  assert.deepEqual(model.states[5].cells.map(cell => cell.value), [10, 20, 30]);
  assert.equal(model.states[6].sum, 60);
  assert.equal(model.output, 'sum = 60\n');
  const freed = model.states.find(state => state.phase === 'free');
  assert.equal(freed.pointer, 'dangling');
  assert.ok(freed.cells.every(cell => cell.live === false && cell.value === null));
  assert.equal(model.states.at(-1).pointer, null);
});

test('controlled allocation failure never creates, accesses or releases cells', () => {
  const model = buildTrace({ scenario: 'allocation', failAllocation: true });
  assert.deepEqual(model.states.map(state => state.phase), ['ready', 'allocate', 'check', 'failure', 'done']);
  assert.ok(model.states.every(state => state.pointer === null && state.cells.length === 0));
  assert.equal(model.output, 'Allocation failed\n');
  assert.match(model.code, /Controlled learning example: force/);
  assert.ok(!model.code.includes('= malloc('));
});

test('pointer trace states are independent and point to valid source lines', () => {
  for (const config of [{}, { scenario: 'allocation' }, { scenario: 'allocation', failAllocation: true }]) {
    const model = buildTrace(config);
    assert.equal(model.states[0].output, '');
    assert.equal(model.states.at(-1).output, model.output);
    for (const state of model.states) assert.ok(state.line === null || Number.isInteger(state.line) && state.line >= 0 && state.line < model.code.split('\n').length);
    const state = model.states.find(item => item.cells.length);
    if (state) {
      state.cells[0].value = 999;
      assert.ok(model.states.filter(item => item !== state).every(item => item.cells.every(cell => cell.value !== 999)));
      const fresh = buildTrace(config);
      assert.ok(fresh.states.every(item => item.cells.every(cell => cell.value !== 999)));
    }
  }
});

test('pointer model rejects unsafe reads and invalid configuration', () => {
  assert.throws(() => buildTrace({ scenario: 'unknown' }), RangeError);
  assert.throws(() => buildTrace({ failAllocation: 'false' }), TypeError);
  assert.throws(() => buildTrace({ failAllocation: true }), RangeError);
  const alias = buildTrace(), allocation = buildTrace({ scenario: 'allocation' });
  assert.throws(() => readCell(null), TypeError);
  assert.throws(() => readCell(alias.states[0]), /NULL/);
  assert.throws(() => readCell(allocation.states[1]), /uninitialized/);
  assert.throws(() => readCell(allocation.states.find(state => state.phase === 'free')), /dangling/);
  assert.throws(() => readCell(allocation.states.find(state => state.phase === 'clear')), /NULL/);
  for (const index of [-1, 1.5, 3]) assert.throws(() => readCell(allocation.states[5], index), RangeError);
  assert.equal(readCell(allocation.states[5], 2), 30);
  const ended = { ...alias.states[2], cells: [{ label: 'value', live: false, value: 10 }] };
  assert.throws(() => readCell(ended), /lifetime/);
});

test('C pointer sources compile strictly and match all simulation outputs', { timeout: 180000 }, t => {
  const available = native.available('c');
  if (!available) return t.skip('C compiler is unavailable');
  for (const config of [{}, { scenario: 'allocation' }, { scenario: 'allocation', failAllocation: true }]) {
    const model = buildTrace(config);
    assert.equal(native.execute('c', model.code, available), model.output);
  }
});
