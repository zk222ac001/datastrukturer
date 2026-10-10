'use strict';
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CodeVizArrays = factory();
})(typeof window === 'undefined' ? globalThis : window, () => {
  const validValue = value => Number.isInteger(value) && Math.abs(value) <= 100;
  function checkValues(values) {
    if (!Array.isArray(values) || values.length < 1 || values.length > 12 || Array.from(values).some(v => v !== null && !validValue(v))) {
      throw new RangeError('The model supports 1–12 elements, each an integer from −100 to 100 or uninitialized.');
    }
  }
  function createValues(size = 5, initializers = [4, 8, 12, 16, 20]) {
    if (!Number.isInteger(size) || size < 1 || size > 12) throw new RangeError('Use an array length from 1 to 12.');
    if (initializers === null) return Array(size).fill(null); // Unknown, never a fabricated C value.
    if (!Array.isArray(initializers) || initializers.length > size || !Array.from(initializers).every(validValue)) throw new RangeError('Initializer values must fit the array and be integers from −100 to 100.');
    return Array.from({ length: size }, (_, i) => i < initializers.length ? initializers[i] : 0);
  }
  function checkIndex(values, index) {
    checkValues(values);
    if (!Number.isInteger(index) || index < 0 || index >= values.length) throw new RangeError(`Index ${index} is outside 0–${values.length - 1}. In C, accessing this element has undefined behavior.`);
  }
  function read(values, index) {
    checkIndex(values, index);
    if (values[index] === null) throw new Error(`values[${index}] is uninitialized. Assign a value before reading it; the simulation will not invent an output.`);
    return values[index];
  }
  function write(values, index, value) {
    checkIndex(values, index);
    if (!validValue(value)) throw new RangeError('Use an integer from −100 to 100.');
    const next = values.slice(); next[index] = value; return next;
  }
  function traversalTrace(values, reverse = false) {
    checkValues(values);
    values.forEach((_, i) => read(values, i));
    let index = reverse ? values.length - 1 : 0, iterations = 0;
    const states = [], output = [];
    const add = (phase, condition = null, activeIndex = null) => states.push({ phase, index, iterations, condition, activeIndex, output: output.join('') });
    add('ready'); add('initialize');
    while (true) {
      const condition = reverse ? index >= 0 : index < values.length;
      add('condition', condition);
      if (!condition) break;
      output.push(read(values, index) + '\n'); iterations++;
      add('read', null, index);
      index += reverse ? -1 : 1; add('update');
    }
    add('terminate', false);
    return states;
  }
  return { createValues, read, write, traversalTrace };
});
