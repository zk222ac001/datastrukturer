'use strict';
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CodeVizFunctions = factory();
})(typeof window === 'undefined' ? globalThis : window, () => {
  // A bounded logical call-stack model, independent of physical runtime layout.
  function factorialTrace(n = 5) {
    if (!Number.isInteger(n) || n < 0 || n > 6) throw new RangeError('Choose an integer from 0 to 6.');
    const frames = [], states = [];
    const snapshot = (phase, message, result = null) => states.push({ phase, message, result, frames: frames.map(f => ({ ...f })) });
    snapshot('ready', `Ready to call factorial(${n}).`);
    function visit(value) {
      frames.push({ n: value, status: 'evaluating', value: null });
      snapshot('call', `Call factorial(${value}); create a separate frame with n = ${value}.`);
      snapshot('condition', `Is ${value} <= 1? ${value <= 1 ? 'Yes: use the base case.' : 'No: make a smaller call.'}`);
      let result;
      if (value <= 1) {
        result = 1; frames.at(-1).value = result; frames.at(-1).status = 'returning';
        snapshot('base', `The base case returns 1, including factorial(0).`, result);
      } else {
        frames.at(-1).status = `waiting for factorial(${value - 1})`;
        snapshot('recurse', `Suspend this frame while factorial(${value - 1}) runs.`);
        const child = visit(value - 1);
        result = value * child;
        frames.at(-1).status = 'returning'; frames.at(-1).value = result;
        snapshot('multiply', `Resume factorial(${value}): ${value} × ${child} = ${result}.`, result);
      }
      frames.pop(); snapshot('return', `Remove the completed frame; return ${result} to its caller.`, result);
      return result;
    }
    const result = visit(n);
    snapshot('done', `The caller receives ${result} and prints it. All factorial frames have returned.`, result);
    return { n, result, states };
  }
  return { factorialTrace };
});
