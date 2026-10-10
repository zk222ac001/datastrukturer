'use strict';
// Pure learning models shared by lessons and Node tests. No student code is evaluated.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CodeVizLearning = factory();
})(typeof window === 'undefined' ? globalThis : window, () => {
  function loopTrace({ start = 1, end = 5, step = 1 } = {}) {
    if (![start, end, step].every(Number.isSafeInteger) || step === 0 ||
        [start, end, step].some(n => Math.abs(n) > 100)) {
      throw new RangeError('Use integers from -100 to 100 and a nonzero step.');
    }
    const states = [];
    let counter = start, iterations = 0;
    const output = [];
    const add = (phase, condition = null) => states.push({ phase, counter, condition, iterations, output: output.join('') });
    add('ready');
    add('initialize');
    while (true) {
      const condition = step > 0 ? counter <= end : counter >= end;
      add('condition', condition);
      if (!condition) break;
      output.push(counter + '\n');
      iterations++;
      add('body');
      counter += step;
      add('update');
    }
    add('terminate', false);
    return states;
  }

  class Quiz {
    constructor(questions) {
      if (!Array.isArray(questions) || !questions.length || questions.some(q =>
        !Array.isArray(q.options) || !Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length)) {
        throw new TypeError('Each question needs options and a valid answer index.');
      }
      this.questions = questions;
      this.retry();
    }
    answer(index, choice) {
      const q = this.questions[index];
      if (!q || !Number.isInteger(choice) || choice < 0 || choice >= q.options.length) throw new RangeError('Invalid choice.');
      // An attempt locks each answer; retry explicitly starts a new attempt.
      if (this.answers[index] === null) this.answers[index] = choice;
      return { correct: this.answers[index] === q.answer, explanation: q.explanation };
    }
    result() {
      const answered = this.answers.filter(a => a !== null).length;
      const score = this.answers.reduce((n, a, i) => n + (a === this.questions[i].answer ? 1 : 0), 0);
      return { score, total: this.questions.length, answered, complete: answered === this.questions.length };
    }
    retry() { this.answers = this.questions.map(() => null); }
  }

  function createProgressStore(getStorage = () => window.localStorage) {
    const key = 'codeviz-progress-v1';
    let memory = {}, persistent = true;
    const validResult = r => r && Number.isInteger(r.score) && Number.isInteger(r.total) && r.total > 0 && r.score >= 0 && r.score <= r.total;
    function read() {
      if (!persistent) return memory;
      try {
        const raw = getStorage().getItem(key);
        const parsed = raw ? JSON.parse(raw) : {};
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid progress');
        memory = parsed;
      } catch { persistent = false; }
      return memory;
    }
    function get(id) {
      const entry = read()[id];
      if (!entry || typeof entry !== 'object') return { completed: false, latest: null, best: null, attempts: 0 };
      const latest = validResult(entry.latest) ? entry.latest : null;
      return {
        completed: entry.completed === true,
        latest,
        best: validResult(entry.best) ? entry.best : latest,
        attempts: Number.isSafeInteger(entry.attempts) && entry.attempts >= 0 ? entry.attempts : 0
      };
    }
    function save(id, entry) {
      // Call get/read before save so updates preserve other lessons.
      memory[id] = entry;
      try { getStorage().setItem(key, JSON.stringify(memory)); persistent = true; }
      catch { persistent = false; }
      return entry;
    }
    return {
      get,
      complete(id, completed = true) { return save(id, { ...get(id), completed }); },
      recordQuiz(id, result) {
        if (!validResult(result) || result.complete !== true) throw new TypeError('Only completed quiz results can be saved.');
        const old = get(id), latest = { score: result.score, total: result.total };
        const best = !old.best || latest.score / latest.total > old.best.score / old.best.total ? latest : old.best;
        return save(id, { ...old, latest, best, attempts: old.attempts + 1 });
      },
      isPersistent: () => persistent
    };
  }
  return { loopTrace, Quiz, createProgressStore };
});
