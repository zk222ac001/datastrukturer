const { test } = require('node:test');
const assert = require('node:assert/strict');
const D = require('../pointers-data.js');
const native = require('./native-program.cjs');

test('Pointers data includes ten explicit locale fallbacks and complete C quiz/exercises', () => {
  assert.deepEqual(Object.keys(D.locales).sort(), ['ar', 'da', 'de', 'en', 'es', 'fr', 'hi', 'pt', 'ur', 'zh']);
  for (const locale of Object.values(D.locales)) {
    assert.equal(locale.length, 3);
    assert.ok(locale.every(text => typeof text === 'string' && text.length > 0));
  }
  assert.equal(D.questions.length, 5);
  for (const question of D.questions) {
    assert.ok(Number.isInteger(question.answer));
    assert.ok(question.answer >= 0 && question.answer < question.options.length);
    assert.ok(question.explanation.length > 30);
  }
  assert.equal(D.exercises.length, 2);
});

for (const language of Object.keys(D.examples)) test(`Pointers ${language}: selected-language example runs`, { timeout: 120000 }, t => {
  const version = native.available(language);
  if (!version) return t.skip(`${language} compiler/runtime unavailable`);
  const example = D.examples[language];
  assert.equal(native.execute(language, example.code, version), example.output);
});

test('Pointers C11 tutorial samples and exercise solutions run with strict warnings', { timeout: 120000 }, t => {
  const version = native.available('c');
  if (!version) return t.skip('C compiler unavailable');
  for (const [name, sample] of Object.entries(D.samples)) assert.equal(native.execute('c', sample.code, version), sample.output, name);
  for (const exercise of D.exercises) assert.equal(native.execute('c', exercise.solution, version), exercise.expected, exercise.title);
  // Starters are real editor programs but their incomplete outputs do not imply grading.
  assert.equal(native.execute('c', D.exercises[0].starter, version), 'a = 3, b = 9\n');
  assert.equal(native.execute('c', D.exercises[1].starter, version), 'sum = 0\n');
});

test('Pointer swap solution handles aliases, equal values, negative values and NULL arguments', { timeout: 120000 }, t => {
  const version = native.available('c');
  if (!version) return t.skip('C compiler unavailable');
  const source = D.exercises[0].solution;
  const body = `int main(void) {
    int a = -7, b = 4;
    swap(&a, &b);
    printf("%d %d\\n", a, b);
    swap(&a, &a);
    printf("%d\\n", a);
    swap(NULL, &b);
    swap(&a, NULL);
    swap(NULL, NULL);
    printf("%d %d\\n", a, b);
    int c = 2, d = 2;
    swap(&c, &d);
    printf("%d %d\\n", c, d);
    return 0;
}
`;
  assert.equal(native.execute('c', source.replace(/int main\(void\) \{[\s\S]*$/, body), version), '4 -7\n4\n4 -7\n2 2\n');
});

test('Dynamic sum solution uses the initialized collection length rather than a hard-coded total', { timeout: 120000 }, t => {
  const version = native.available('c');
  if (!version) return t.skip('C compiler unavailable');
  for (const [count, expected] of [[1, 2], [3, 12], [5, 30]]) {
    const source = D.exercises[1].solution.replace('const size_t count = 5;', `const size_t count = ${count};`);
    assert.equal(native.execute('c', source, version), `sum = ${expected}\n`);
  }
});
