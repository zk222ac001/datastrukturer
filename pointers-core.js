'use strict';
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CodeVizPointers = factory();
})(typeof window === 'undefined' ? globalThis : window, () => {
  // Addresses are symbolic labels for this lesson, never real machine addresses.
  function buildTrace({ scenario = 'alias', failAllocation = false } = {}) {
    if (!['alias', 'allocation'].includes(scenario)) throw new RangeError('Choose the alias or allocation scenario.');
    if (typeof failAllocation !== 'boolean') throw new TypeError('failAllocation must be a boolean.');
    if (scenario === 'alias' && failAllocation) throw new RangeError('Allocation failure only applies to the allocation scenario.');
    const lines = [], locations = {}, states = [];
    let pointer = null, helperPointer = null, cells = [], output = '', sum = null;
    const add = (line, key) => { if (key) locations[key] = lines.length; lines.push(line); };
    const snapshot = (phase, message, key = null) => states.push({
      phase, message, line: key === null ? null : locations[key], pointer, helperPointer,
      cells: cells.map(cell => ({ ...cell })), output, sum
    });
    add('#include <stdio.h>');
    if (scenario === 'allocation') add('#include <stdlib.h>');
    add('');
    if (scenario === 'alias') {
      add('static void setValue(int *target) {');
      add('    *target = 30;', 'functionWrite');
      add('    return;', 'return');
      add('}');
      add('');
      add('int main(void) {');
      add('    int value = 10;', 'initialize');
      add('    int *p = &value;', 'address');
      add('    *p = 20;', 'write');
      add('    setValue(p);', 'call');
      add('    printf("value = %d\\n", value);', 'output');
      add('    return 0;', 'done');
      add('}');
      snapshot('ready', 'Ready to create a value and a pointer to it.');
      cells = [{ label: 'value', value: 10, live: true }];
      snapshot('initialize', 'Create the local integer value and store 10.', 'initialize');
      pointer = '&value';
      snapshot('address', 'The address-of operator & gives p the address of value. The displayed address is symbolic.', 'address');
      cells[0].value = 20;
      snapshot('write', 'Dereferencing p with *p writes 20 into the same value cell.', 'write');
      helperPointer = '&value';
      snapshot('call', 'C passes the pointer value by value. The copied parameter target points to the same integer.', 'call');
      cells[0].value = 30;
      snapshot('function-write', 'The function writes 30 through its copied pointer target; value in main changes.', 'functionWrite');
      helperPointer = null;
      snapshot('return', 'Return to main. The function parameter ends its lifetime; value and p remain live.', 'return');
      output = 'value = 30\n';
      snapshot('output', 'Read value and print the result of the function mutation.', 'output');
      snapshot('done', 'The program exits. The local variable lifetime ends when main returns.', 'done');
    } else {
      add('int main(void) {');
      if (failAllocation) {
        add('    /* Controlled learning example: force the allocation-failure branch. */');
        add('    int *values = NULL;', 'allocate');
      } else add('    int *values = malloc(3 * sizeof *values);', 'allocate');
      add('    if (values == NULL) {', 'check');
      add('        puts("Allocation failed");', 'failure');
      add('        return 0;', 'failureExit');
      add('    }');
      for (const [index, value] of [10, 20, 30].entries()) add(`    values[${index}] = ${value};`, 'initialize' + index);
      add('    int sum = values[0] + values[1] + values[2];', 'sum');
      add('    printf("sum = %d\\n", sum);', 'output');
      add('    free(values);', 'free');
      add('    values = NULL;', 'clear');
      add('    return 0;', 'done');
      add('}');
      snapshot('ready', 'Ready to request space for three integers.');
      if (failAllocation) {
        snapshot('allocate', 'This controlled learning example deliberately sets values to NULL instead of calling malloc.', 'allocate');
        snapshot('check', 'values is NULL. Take the failure branch before any element access.', 'check');
        output = 'Allocation failed\n';
        snapshot('failure', 'Print the failure message. There is no allocated memory to read or release.', 'failure');
        snapshot('done', 'Exit cleanly from the controlled failure branch.', 'failureExit');
      } else {
        pointer = 'values[0]';
        cells = [0, 1, 2].map(index => ({ label: `values[${index}]`, value: null, live: true }));
        snapshot('allocate', 'For this successful path, malloc returns storage for three integers. Their values are not initialized yet.', 'allocate');
        snapshot('check', 'values is not NULL, so continue. Real code must check every allocation before using it.', 'check');
        for (const [index, value] of [10, 20, 30].entries()) {
          cells[index].value = value;
          snapshot('initialize', `Initialize values[${index}] to ${value}.`, 'initialize' + index);
        }
        sum = cells.reduce((total, cell) => total + cell.value, 0);
        snapshot('sum', 'Read the three initialized elements and add them: 10 + 20 + 30 = 60.', 'sum');
        output = 'sum = 60\n';
        snapshot('output', 'Print the sum while the allocated cells are still live.', 'output');
        cells = cells.map(cell => ({ ...cell, value: null, live: false }));
        pointer = 'dangling';
        snapshot('free', 'free releases the storage. The old pointer is now dangling and must not be dereferenced or freed again.', 'free');
        pointer = null;
        snapshot('clear', 'Set values to NULL so this variable no longer holds the released address. This does not clear other aliases.', 'clear');
        snapshot('done', 'The program exits with its allocated memory already released.', 'done');
      }
    }
    return { code: lines.join('\n') + '\n', states, output };
  }

  function readCell(state, index = 0) {
    if (!state || !Array.isArray(state.cells)) throw new TypeError('Provide a pointer simulation state.');
    if (state.pointer === null) throw new Error('Cannot dereference a NULL pointer.');
    if (state.pointer === 'dangling') throw new Error('Cannot dereference a dangling pointer to freed storage.');
    if (!['&value', 'values[0]'].includes(state.pointer)) throw new Error('The pointer has no initialized target.');
    if (!Number.isInteger(index) || index < 0 || index >= state.cells.length) throw new RangeError('The element index is outside the pointed-to object.');
    const cell = state.cells[index];
    if (!cell.live) throw new Error('Cannot read a cell after its lifetime has ended.');
    if (cell.value === null) throw new Error('Cannot read an uninitialized integer.');
    return cell.value;
  }
  return { buildTrace, readCell };
});
