'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = { window: {} };
vm.runInNewContext(fs.readFileSync('assignments-data.js', 'utf8'), context);
const assignments = context.window.LESSON_ASSIGNMENTS;
const labels = context.window.LESSON_ASSIGNMENT_LABELS;

test('every course topic and detailed lesson section has a coding assignment', () => {
  assert.equal(Object.keys(assignments).length, 84);
  const required = [
    'computers', 'libraries', 'ai', 'embedded', 'bigdata', 'run', 'hello',
    'formatting', 'types', 'variables', 'memory', 'io', 'decisions',
    'arithmetic', 'precedence', 'relational', 'logic', 'truth', 'algorithm',
    'pseudocode', 'flowchart', 'selection', 'switch', 'assignment', 'iteration',
    'counter', 'sentinel', 'jump', 'increment', 'loops', 'arrays',
    'functions-1', 'functions-8', 'pointers-1', 'pointers-5', 'oop-1',
    'oop-protected', 'file-handling-1', 'file-handling-safety',
    'exception-handling-1', 'exception-handling-4', 'unit-testing-1',
    'unit-testing-5', 'unit-testing-practice'
  ];
  for (const id of required) {
    assert.ok(assignments[id], `missing assignment for ${id}`);
    assert.ok(assignments[id].task.trim());
    assert.ok(assignments[id].expected.trim());
  }
  assert.equal(assignments.io.stdin, '5\n');
});

test('assignment labels cover all interface languages', () => {
  assert.deepEqual(Object.keys(labels).sort(), ['ar', 'da', 'de', 'en', 'es', 'fr', 'hi', 'pt', 'ur', 'zh']);
  for (const translation of Object.values(labels)) {
    assert.ok(translation.title);
    assert.ok(translation.task);
    assert.ok(translation.expected);
    assert.ok(translation.open);
    assert.ok(translation.solution);
    assert.ok(translation.hideSolution);
    assert.ok(translation.note);
  }
});
