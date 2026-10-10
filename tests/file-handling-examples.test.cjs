const { test } = require('node:test');
const assert = require('node:assert/strict');
const D = require('../file-handling-data.js');
const native = require('./native-program.cjs');

test('File Handling data includes all supported locales and language examples', () => {
  assert.deepEqual(Object.keys(D.locales).sort(), ['ar', 'da', 'de', 'en', 'es', 'fr', 'hi', 'pt', 'ur', 'zh']);
  for (const locale of Object.values(D.locales)) {
    assert.equal(locale.length, 3);
    assert.ok(locale.every(text => typeof text === 'string' && text.length > 0));
  }
  assert.deepEqual(Object.keys(D.examples).sort(), ['c', 'cpp', 'csharp', 'java', 'javascript', 'python']);
  assert.equal(D.questions.length, 5);
  assert.match(D.examples.c.note, /C has no built-in classes/);
  assert.match(D.examples.javascript.note, /Node\.js/);
});

for (const language of Object.keys(D.examples)) test(`File Handling ${language}: example writes and reads the expected text`, { timeout: 120000 }, t => {
  const version = native.available(language);
  if (!version) return t.skip(`${language} compiler/runtime unavailable`);
  const example = D.examples[language];
  assert.equal(native.execute(language, example.code, version), example.output);
});
