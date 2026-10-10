const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loopTrace, Quiz, createProgressStore } = require('../learning-core.js');
const vm = require('node:vm');
const fs = require('node:fs');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync('for-lesson-data.js', 'utf8'), sandbox);
const questions = sandbox.window.FOR_LESSON_DATA.questions;

test('loop executes initialization, checks, bodies and updates in C order', () => {
  const trace = loopTrace({ start: 1, end: 3, step: 1 });
  assert.deepEqual(trace.map(s => s.phase), ['ready', 'initialize', 'condition', 'body', 'update', 'condition', 'body', 'update', 'condition', 'body', 'update', 'condition', 'terminate']);
  assert.deepEqual(trace.filter(s => s.phase === 'condition').map(s => [s.counter, s.condition]), [[1, true], [2, true], [3, true], [4, false]]);
  assert.equal(trace.at(-1).output, '1\n2\n3\n');
  assert.equal(trace.at(-1).iterations, 3);
  assert.equal(trace[3].output, '1\n'); // Older snapshots are immutable by subsequent output.
  assert.equal(trace[4].counter, 2);
});
test('zero iterations, descending and non-unit updates terminate correctly', () => {
  for (const config of [{ start: 5, end: 1, step: 1 }, { start: 1, end: 5, step: -1 }]) {
    const trace = loopTrace(config);
    assert.deepEqual(trace.map(s => s.phase), ['ready', 'initialize', 'condition', 'terminate']);
    assert.equal(trace.at(-1).output, '');
    assert.equal(trace.at(-1).iterations, 0);
  }
  assert.equal(loopTrace({ start: 3, end: 1, step: -1 }).at(-1).output, '3\n2\n1\n');
  assert.equal(loopTrace({ start: 2, end: 10, step: 2 }).at(-1).output, '2\n4\n6\n8\n10\n');
  assert.equal(loopTrace({ start: -2, end: 2, step: 3 }).at(-1).output, '-2\n1\n');
  assert.equal(loopTrace({ start: 0, end: 0, step: -1 }).at(-1).iterations, 1);
  assert.equal(loopTrace({ start: -100, end: 100, step: 1 }).at(-1).iterations, 201);
});
test('loop refuses invalid or unbounded configuration', () => {
  for (const config of [{ step: 0 }, { start: NaN }, { end: Infinity }, { step: 0.5 }, { start: 101 }]) assert.throws(() => loopTrace(config), RangeError);
});
test('quiz feedback, score, locked answers and retry', () => {
  const quiz = new Quiz(questions);
  assert.deepEqual(quiz.result(), { score: 0, total: 5, answered: 0, complete: false });
  questions.forEach((q, i) => {
    const result = quiz.answer(i, i === 0 ? 1 : q.answer);
    assert.equal(result.correct, i !== 0);
    assert.equal(result.explanation, q.explanation);
  });
  assert.deepEqual(quiz.result(), { score: 4, total: 5, answered: 5, complete: true });
  quiz.answer(0, 0); assert.equal(quiz.result().score, 4);
  quiz.retry(); assert.equal(quiz.result().answered, 0);
  questions.forEach((q, i) => quiz.answer(i, q.answer));
  assert.equal(quiz.result().score, 5);
  assert.throws(() => quiz.answer(20, 0), RangeError);
  assert.throws(() => quiz.answer(0, -1), RangeError);
  assert.throws(() => new Quiz([{ options: ['a'], answer: 2 }]), TypeError);
});
function storage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), clear: () => values.clear() };
}
test('progress survives reload, separates lessons and keeps latest/best quiz results', () => {
  const disk = storage(), store = createProgressStore(() => disk);
  store.complete('first'); store.complete('other');
  store.recordQuiz('first', { score: 4, total: 5, complete: true });
  store.recordQuiz('first', { score: 2, total: 5, complete: true });
  const loaded = createProgressStore(() => disk);
  assert.deepEqual(loaded.get('first'), { completed: true, latest: { score: 2, total: 5 }, best: { score: 4, total: 5 }, attempts: 2 });
  assert.equal(loaded.get('other').completed, true);
  loaded.complete('first', false); assert.equal(loaded.get('first').completed, false);
  assert.throws(() => store.recordQuiz('first', { score: 1, total: 5, complete: false }), TypeError);
  assert.throws(() => store.recordQuiz('first', { score: 6, total: 5, complete: true }), TypeError);
  disk.clear(); assert.equal(loaded.get('first').completed, false);
});
test('blocked storage and write-only failures preserve session progress', () => {
  for (const access of [() => { throw new Error('Blocked'); }, () => ({ getItem: () => null, setItem: () => { throw new Error('Quota'); } })]) {
    const store = createProgressStore(access);
    store.complete('lesson');
    store.recordQuiz('lesson', { score: 3, total: 5, complete: true });
    assert.equal(store.get('lesson').completed, true);
    assert.equal(store.get('lesson').latest.score, 3);
    assert.equal(store.isPersistent(), false);
  }
});
test('malformed and outdated progress fail gracefully', () => {
  for (const raw of ['{bad', 'null', '[]']) {
    const disk = storage(); disk.setItem('codeviz-progress-v1', raw);
    const store = createProgressStore(() => disk);
    assert.equal(store.get('lesson').completed, false);
    store.complete('lesson'); assert.equal(store.get('lesson').completed, true);
  }
  const disk = storage();
  disk.setItem('codeviz-progress-v1', JSON.stringify({ lesson: { latest: { score: '5', total: 5 }, best: { score: 9, total: 5 }, attempts: -1 } }));
  assert.deepEqual(createProgressStore(() => disk).get('lesson'), { completed: false, latest: null, best: null, attempts: 0 });
});
