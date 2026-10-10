'use strict';
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CodeVizSwitch = factory();
})(typeof window === 'undefined' ? globalThis : window, () => {
  const languages = ['c', 'cpp', 'python', 'java', 'javascript', 'csharp'];
  const canFallThrough = language => ['c', 'cpp', 'java', 'javascript'].includes(language);
  function build({ language = 'c', choice = 2, breakAfterFirst = true, includeDefault = true } = {}) {
    if (!languages.includes(language) || !Number.isInteger(choice) || choice < 0 || choice > 3 ||
        typeof breakAfterFirst !== 'boolean' || typeof includeDefault !== 'boolean') throw new RangeError('Choose a supported language and an integer choice from 0 to 3.');
    if (!breakAfterFirst && !canFallThrough(language)) throw new Error('This example does not allow implicit fall-through in Python or C#.');
    const lines = [], locations = {};
    const add = (line, key) => { if (key) locations[key] = lines.length; lines.push(line); };
    const python = language === 'python';
    const indent = ['java', 'csharp'].includes(language) ? '        ' : ['c', 'cpp'].includes(language) ? '    ' : '';
    const print = text => ({ c: `puts("${text}");`, cpp: `std::cout << "${text}\\n";`, java: `System.out.println("${text}");`, javascript: `console.log("${text}");`, csharp: `Console.WriteLine("${text}");`, python: `print("${text}")` }[language]);
    if (language === 'c') { add('#include <stdio.h>'); add(''); add('int main(void) {'); }
    if (language === 'cpp') { add('#include <iostream>'); add(''); add('int main() {'); }
    if (language === 'java') { add('public class Main {'); add('    public static void main(String[] args) {'); }
    if (language === 'csharp') { add('using System;'); add(''); add('class Program {'); add('    static void Main() {'); }
    add(indent + (python ? `choice = ${choice}` : `${language === 'javascript' ? 'const' : 'int'} choice = ${choice};`), 'initialize');
    add(indent + (python ? 'match choice:' : 'switch (choice) {'), 'dispatch');
    for (const n of [1, 2]) {
      add(indent + (python ? `    case ${n}:` : `    case ${n}:`), 'case' + n);
      add(indent + '        ' + print(n === 1 ? 'Start' : 'Help'), 'body' + n);
      if (!python) {
        if (n === 2 || breakAfterFirst) add(indent + '        break;', 'break' + n);
        else add(indent + '        ' + (language === 'cpp' ? '[[fallthrough]];' : '/* fall through */'));
      }
    }
    if (includeDefault) {
      add(indent + (python ? '    case _:' : '    default:'), 'default');
      add(indent + '        ' + print('Unknown choice'), 'bodyDefault');
      if (!python) add(indent + '        break;', 'breakDefault');
    }
    if (!python) add(indent + '}');
    add(indent + print('After selection'), 'after');
    if (['c', 'cpp'].includes(language)) { add('    return 0;'); add('}'); }
    if (['java', 'csharp'].includes(language)) { add('    }'); add('}'); }
    const selected = choice === 1 || choice === 2 ? 'case ' + choice : includeDefault ? python ? 'case _' : 'default' : 'No match';
    const states = [], output = [];
    const snapshot = (phase, key = null, active = null) => states.push({ phase, line: key === null ? null : locations[key], selected, active, output: output.join('') });
    snapshot('ready'); snapshot('initialize', 'initialize'); snapshot('dispatch', 'dispatch');
    if (choice === 1 || choice === 2) {
      output.push(choice === 1 ? 'Start\n' : 'Help\n'); snapshot('body', 'body' + choice, 'case ' + choice);
      if (choice === 1 && !breakAfterFirst) {
        snapshot('fallthrough', 'case2', 'case 2'); output.push('Help\n'); snapshot('body', 'body2', 'case 2');
        snapshot('break', 'break2', 'case 2');
      } else if (!python) snapshot('break', 'break' + choice, 'case ' + choice);
    } else if (includeDefault) {
      output.push('Unknown choice\n'); snapshot('body', 'bodyDefault', selected);
      if (!python) snapshot('break', 'breakDefault', selected);
    }
    output.push('After selection\n'); snapshot('after', 'after'); snapshot('terminate');
    return { code: lines.join('\n') + '\n', states, output: output.join(''), selected };
  }
  return { build, canFallThrough };
});
