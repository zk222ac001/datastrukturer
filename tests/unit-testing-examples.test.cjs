const { test } = require('node:test');
const assert = require('node:assert/strict');
const D = require('../unit-testing-data.js');
const native = require('./native-program.cjs');

test('Unit Testing data includes all supported locales and language examples', () => {
  assert.deepEqual(Object.keys(D.locales).sort(), ['ar', 'da', 'de', 'en', 'es', 'fr', 'hi', 'pt', 'ur', 'zh']);
  for (const locale of Object.values(D.locales)) {
    assert.equal(locale.length, 3);
    assert.ok(locale.every(text => typeof text === 'string' && text.length > 0));
  }
  assert.deepEqual(Object.keys(D.examples).sort(), ['c', 'cpp', 'csharp', 'java', 'javascript', 'python']);
  assert.equal(D.questions.length, 5);
  assert.match(D.examples.c.note, /assertions are disabled when NDEBUG is defined/i);
  assert.match(D.examples.python.note, /optimization that removes assert statements/);
});

for (const language of Object.keys(D.examples)) test(`Unit Testing ${language}: assertions pass and report expected results`, { timeout: 120000 }, t => {
  const version = native.available(language);
  if (!version) return t.skip(`${language} compiler/runtime unavailable`);
  const example = D.examples[language];
  assert.equal(native.execute(language, example.code, version), example.output);
});
