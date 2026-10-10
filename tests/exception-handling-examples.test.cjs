const { test } = require('node:test');
const assert = require('node:assert/strict');
const D = require('../exception-handling-data.js');
const native = require('./native-program.cjs');

test('Exception Handling data includes all supported locales and language examples', () => {
  assert.deepEqual(Object.keys(D.locales).sort(), ['ar', 'da', 'de', 'en', 'es', 'fr', 'hi', 'pt', 'ur', 'zh']);
  for (const locale of Object.values(D.locales)) {
    assert.equal(locale.length, 3);
    assert.ok(locale.every(text => typeof text === 'string' && text.length > 0));
  }
  assert.deepEqual(Object.keys(D.examples).sort(), ['c', 'cpp', 'csharp', 'java', 'javascript', 'python']);
  assert.equal(D.questions.length, 5);
  assert.match(D.examples.c.note, /does not have built-in exceptions/);
});

for (const language of Object.keys(D.examples)) test(`Exception Handling ${language}: example reports and handles the invalid value`, { timeout: 120000 }, t => {
  const version = native.available(language);
  if (!version) return t.skip(`${language} compiler/runtime unavailable`);
  const example = D.examples[language];
  assert.equal(native.execute(language, example.code, version), example.output);
});
