'use strict';
(() => {
  const D = window.FUNCTIONS_DATA, { esc, mountQuiz } = window.CodeVizLearningUI;
  const store = window.CodeVizLearning.createProgressStore(), quizzes = new Map();
  let context, n = 5, position = 0;
  const progressId = () => `functions-${context.codeLanguage}-en-v1`;
  const model = () => window.CodeVizFunctions.factorialTrace(n);
  function questions(language) {
    const mutation = ['cpp', 'csharp'].includes(language) ? 'A reference parameter can alias the caller’s variable.' : language === 'c' ? 'The pointer is passed by value; writing through it can change the caller’s object.' : 'Sharing an object allows mutation without rebinding the caller’s variable.';
    return [
      { prompt: 'What is a parameter?', options: ['The returned answer', 'A named input in a function definition', 'Always a global variable', 'A loop'], answer: 1, explanation: 'Parameters name the inputs. Arguments are the actual values or objects supplied by a call.' },
      { prompt: 'What does add(3, 4) return in the example?', options: ['3', '4', '7', '34'], answer: 2, explanation: 'The function returns a + b, so 3 + 4 gives 7. Returning a value does not print it by itself.' },
      { prompt: 'After changeCopy(value), where value initially holds 10, what does the argument example print first?', options: ['20', '0', 'An error', '10'], answer: 3, explanation: 'Reassigning the local parameter does not change the caller’s integer binding. ' + mutation },
      { prompt: 'Which factorial call stops without making another recursive call?', options: ['factorial(1)', 'factorial(5)', 'factorial(4)', 'factorial(3)'], answer: 0, explanation: 'n <= 1 is the base case. Each positive larger input moves toward it by subtracting one.' },
      { prompt: 'What is the difference between scope and lifetime?', options: ['They mean exactly the same thing', 'Scope describes where a name is usable; lifetime describes when an object exists', 'Scope is always global', 'Lifetime is the number of parameters'], answer: 1, explanation: 'A retained counter can exist between calls even when its name is not accessible to the caller.' }
    ];
  }
  function example(key, title) {
    const ex = D.examples[context.codeLanguage][key];
    return `<details class="sample" ${key === 'basic' ? 'open' : ''}><summary>${esc(title)} · ${esc(window.COURSE_DATA.programs[context.codeLanguage].label)}</summary><div class="controls"><button type="button" data-functions-run="${key}">Run real code</button><button type="button" data-functions-copy="${key}">Copy code</button><button type="button" data-functions-download="${key}">Download code</button></div><pre tabindex="0" dir="ltr"><code>${esc(ex.code)}</code></pre><h4>${ex.output === null ? 'Possible output' : 'Expected output'}</h4><pre class="output" dir="ltr">${esc(ex.output === null ? '4\n(your result can be any integer from 1 through 6)' : ex.output.trimEnd())}</pre></details>`;
  }
  const sources = {
    c: 'https://learn.microsoft.com/en-us/cpp/c-language/function-prototypes?view=msvc-170',
    cpp: 'https://learn.microsoft.com/en-us/cpp/cpp/functions-cpp?view=msvc-170',
    python: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions',
    java: 'https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html',
    javascript: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions',
    csharp: 'https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/method-parameters'
  };
  function render(c) {
    if (context?.codeLanguage !== c.codeLanguage) position = 0;
    context = c;
    const note = D.notes[c.codeLanguage];
    return `${c.language !== 'en' ? `<p class="notice">${esc(D.fallback[c.language])}</p>` : ''}<div class="functions-lesson" lang="en" dir="ltr"><nav class="module-outline" aria-label="Functions lesson sections">${D.sections.map((title, i) => `<a class="button" href="#functions-${i + 1}">8.${i + 1} ${esc(title)}</a>`).join('')}</nav>
      <section id="functions-1"><h2>8.1 What is a function?</h2><p>A function is a named piece of code that performs one task. You can reuse it instead of copying the same instructions. Inputs are called <strong>parameters</strong>; a call supplies <strong>arguments</strong>. A function can return a result, perform an action, or both. Java and C# commonly call class functions <strong>methods</strong>.</p><p>Think of <code>add</code> as a small calculator: give it 3 and 4, and it returns 7. Returning sends a value to the caller; printing displays a value. These are different actions. Keep functions focused, choose meaningful names, and use parameters rather than hidden global state.</p><dl class="for-anatomy"><div><dt>Name</dt><dd><code>add</code> identifies the task.</dd></div><div><dt>Parameters</dt><dd><code>a</code> and <code>b</code> name its inputs.</dd></div><div><dt>Body</dt><dd>Instructions compute the sum.</dd></div><div><dt>Return value</dt><dd>The caller receives <code>a + b</code>.</dd></div></dl></section>
      <section id="functions-2"><h2>8.2 Prototype, declaration and call / invoking</h2><p>${esc(note.declaration)}</p><p>A <strong>declaration</strong> introduces a name and its interface. A <strong>definition</strong> supplies the implementation. A <strong>call</strong> asks that implementation to run. In the example, 3 and 4 are arguments; a and b are parameters. Match the number and types of inputs to the selected language’s rules.</p>${example('basic', 'Declaration, definition and invocation')}</section>
      <section id="functions-3"><h2>8.3 Function call stack and stack frames</h2><p>A call temporarily gives control to another function. A logical <strong>stack frame</strong> represents one active invocation: its parameters, local state, and where to continue after it returns. A nested call adds a frame; a return removes it and resumes its caller. The most recent call returns first.</p><p class="tag">Educational simulation</p><p>This bounded model follows factorial for inputs 0–6. It shows logical frames, not physical memory addresses or a debugger’s actual stack. Compilers and runtimes may optimize calls. Each recursive invocation has its own n, while older calls wait.</p><div id="functions-stack"></div></section>
      <section id="functions-4"><h2>8.4 Passing arguments: by value and by reference</h2><p>${esc(note.arguments)}</p><p>Watch the first output stay 10, then the second become 20. Do not equate changing a shared object with replacing the caller’s variable. Use return values when mutation is unnecessary.</p>${example('arguments', 'Compare local reassignment with caller-visible mutation')}</section>
      <section id="functions-5"><h2>8.5 What is a random number generator?</h2><p>A pseudo-random generator uses an algorithm and internal state to produce a sequence that looks random. A <strong>seed</strong> sets starting state. Repeatable sequences are useful when testing a simulation; games often want a varying starting state. Random output is not a guaranteed new value on every call.</p><p>${esc(note.random)}</p><p>The example rolls one die. Check that the result is between 1 and 6; there is no single fixed expected result. These teaching generators should not be used for passwords or security tokens.</p>${example('random', 'Generate a die value')}</section>
      <section id="functions-6"><h2>8.6 Storage classes and lifetime</h2><p>${esc(note.storage)}</p><p>Call the counter twice: the outputs are 1 and 2 because its state is retained. Replacing it with a fresh local initialized to zero on every call would produce 1 twice. Persistent state can be useful for counting requests, but can also make tests and concurrent use harder.</p>${example('storage', 'A counter that retains state')}</section>
      <section id="functions-7"><h2>8.7 Scope rules</h2><p><strong>Scope</strong> answers “Where can this name be used?” <strong>Lifetime</strong> answers “When does this object exist?” Local names help functions work independently.</p><p>${esc(note.scope)}</p><p>In the add example, the caller does not access a or b directly; it supplies arguments and receives a result. The two input names belong to that function. Avoid confusing a same-named local with an outer variable, and prefer the narrowest useful scope.</p></section>
      <section id="functions-8"><h2>8.8 What is a recursive function?</h2><p>A recursive function calls itself, directly or through another function. It needs a <strong>base case</strong> that finishes immediately and a <strong>recursive case</strong> that moves closer to it. Factorial multiplies the positive integers up to n: 5! = 5 × 4 × 3 × 2 × 1 = 120, and 0! = 1.</p><p>The example stops at n ≤ 1 and otherwise calls factorial(n − 1). It is designed for nonnegative small inputs; the simulation accepts only 0–6. Negative input needs an explicit validation policy, and larger inputs can overflow fixed-size integers or exhaust recursion limits. A loop is often simpler for factorial; recursion is especially useful for trees and nested structures.</p>${example('recursion', 'Recursive factorial')}<div class="table-wrap"><table><caption>Unwinding factorial(3)</caption><thead><tr><th scope="col">Call</th><th scope="col">Waits for</th><th scope="col">Returns</th></tr></thead><tbody><tr><td>factorial(3)</td><td>factorial(2)</td><td>3 × 2 = 6</td></tr><tr><td>factorial(2)</td><td>factorial(1)</td><td>2 × 1 = 2</td></tr><tr><td>factorial(1)</td><td>Base case</td><td>1</td></tr></tbody></table></div><h3>Common mistakes</h3><ul><li>Calling a function without using its result when you meant to print it.</li><li>Confusing arguments at the call with parameters in the definition.</li><li>Assuming that changing a local parameter always changes the caller.</li><li>Missing the base case, or recursing without reducing the problem.</li><li>Assuming a name’s visibility and its object’s lifetime are the same.</li></ul></section>
      <section id="functions-quiz" aria-label="Functions quiz"></section><section id="functions-practice"><h2>Practice in the online editor</h2><p>Use Run real code on an example, edit it in the existing editor, and compare the output yourself. These exercises are self-checked; there is no automatic grading.</p><article class="for-challenge"><h3>1. Reuse add</h3><p>Change the basic program to calculate 8 + 3 by calling add, without changing its body. Expected output: <code>11</code>.</p><details><summary>Hint and solution</summary><p>Replace <code>add(3, 4)</code> with <code>add(8, 3)</code>. Parameters receive the new arguments; the function’s calculation stays reusable.</p></details></article><article class="for-challenge"><h3>2. Recursive sum</h3><p>Write sumTo(n), which returns 1 + 2 + … + n for a nonnegative integer. Test n = 0 (output 0) and n = 5 (output 15).</p><details><summary>Hint</summary><p>Return 0 for the base case n = 0; otherwise return n + sumTo(n − 1). Try the same logical frames as factorial, but add instead of multiplying.</p></details><details><summary>Solution</summary><pre tabindex="0" dir="ltr"><code>${esc(sumSolution(c.codeLanguage))}</code></pre><button type="button" data-functions-run="solution">Run solution</button></details></article></section>
      <section aria-label="Functions progress"><h2>Your progress</h2><p>Completion and quiz scores stay in this browser, separately for each programming language. No registration or personal information is needed.</p><div id="functions-progress"></div></section><p class="small"><a href="${esc(sources[c.codeLanguage])}" target="_blank" rel="noopener">Selected language’s function and argument documentation</a>${c.codeLanguage === 'c' ? ' · <a href="https://learn.microsoft.com/en-us/cpp/c-language/storage-class?view=msvc-170" target="_blank" rel="noopener">C storage classes</a>' : ''}</p><p id="functions-code-status" role="status"></p></div>`;
  }
  function sumSolution(language) {
    return D.examples[language].recursion.code.replaceAll('factorial', 'sumTo').replace('n <= 1', 'n <= 0').replace('return 1', 'return 0').replace('n * sumTo', 'n + sumTo');
  }
  function drawStack() {
    const root = document.getElementById('functions-stack'); if (!root) return;
    const m = model(), state = m.states[position];
    const code = D.examples[context.codeLanguage].recursion.code.replace('factorial(5)', `factorial(${n})`);
    const lines = code.trimEnd().split('\n');
    const activeLine = state.phase === 'condition' ? lines.findIndex(l => l.includes('n <= 1')) : state.phase === 'base' || (state.phase === 'return' && state.result === 1) ? lines.findIndex(l => l.includes('return 1')) : ['recurse', 'multiply', 'return'].includes(state.phase) ? lines.findIndex(l => l.includes('n * factorial')) : state.phase === 'call' ? lines.findIndex(l => l.includes('factorial(n)') || l.includes('factorial(int n)')) : state.phase === 'done' ? lines.findIndex(l => l.includes(`factorial(${n})`)) : -1;
    root.innerHTML = `<div class="controls"><label for="functions-n">Factorial input (0–6)</label><select id="functions-n">${Array.from({ length: 7 }, (_, i) => `<option value="${i}" ${i === n ? 'selected' : ''}>${i}</option>`).join('')}</select></div><div class="for-sim-grid"><div><p id="functions-stack-status" role="status"><strong>Step ${position} / ${m.states.length - 1} · ${esc(state.phase)}</strong><br>${esc(state.message)}</p><ol class="function-frames" aria-label="Active factorial frames, oldest first">${state.frames.map((f, i) => `<li ${i === state.frames.length - 1 ? 'aria-current="step"' : ''}><strong>factorial(${f.n})</strong><span>n = ${f.n} · ${esc(f.status)}${f.value !== null ? ' · result = ' + f.value : ''}</span></li>`).join('')}</ol>${state.frames.length ? '<p class="small">Newest frame at the bottom.</p>' : '<p>No active factorial frames. The caller is outside this diagram.</p>'}<div class="controls"><button type="button" data-functions-step="previous" ${position === 0 ? 'disabled' : ''}>Previous</button><button type="button" data-functions-step="next" ${position === m.states.length - 1 ? 'disabled' : ''}>Next</button><button type="button" data-functions-step="reset">Reset</button></div><h3>Program output so far</h3><pre class="output" dir="ltr">${state.phase === 'done' ? state.result : '(no output)'}</pre></div><div><h3>Selected-language recursive source</h3><pre class="for-source" tabindex="0" dir="ltr"><code>${lines.map((line, i) => `<span class="code-line ${i === activeLine ? 'executing' : ''}" ${i === activeLine ? 'aria-current="step"' : ''}>${esc(line) || ' '}</span>`).join('')}</code></pre></div></div>`;
  }
  function drawProgress() {
    const root = document.getElementById('functions-progress'); if (!root) return;
    const p = store.get(progressId());
    root.innerHTML = `<p role="status">${p.completed ? 'Lesson marked complete.' : 'Lesson not yet marked complete.'} ${p.latest ? `Latest quiz: ${p.latest.score}/${p.latest.total}. Best: ${p.best.score}/${p.best.total}. Attempts: ${p.attempts}.` : 'No completed quiz yet.'} ${store.isPersistent() ? '' : 'Browser storage is unavailable. Progress is kept for this page session only.'}</p><button type="button" data-functions-complete>${p.completed ? 'Mark incomplete' : 'Mark lesson complete'}</button>`;
  }
  function mount() {
    const root = document.querySelector('.functions-lesson'); if (!root) return;
    drawStack(); drawProgress();
    if (!quizzes.has(progressId())) quizzes.set(progressId(), new window.CodeVizLearning.Quiz(questions(context.codeLanguage)));
    mountQuiz(root.querySelector('#functions-quiz'), { quiz: quizzes.get(progressId()), id: progressId(), onComplete: result => { store.recordQuiz(progressId(), result); drawProgress(); } });
    root.addEventListener('change', e => {
      if (e.target.id !== 'functions-n') return;
      n = Number(e.target.value); position = 0; drawStack(); root.querySelector('#functions-n').focus();
    });
    root.addEventListener('click', async e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.functionsStep) {
        const action = b.dataset.functionsStep;
        position = action === 'reset' ? 0 : Math.max(0, Math.min(model().states.length - 1, position + (action === 'next' ? 1 : -1)));
        drawStack(); const control = root.querySelector(`[data-functions-step="${action}"]`);
        if (control.disabled) { const status = root.querySelector('#functions-stack-status'); status.tabIndex = -1; status.focus(); } else control.focus();
      }
      if (b.hasAttribute('data-functions-complete')) { store.complete(progressId(), !store.get(progressId()).completed); drawProgress(); root.querySelector('[data-functions-complete]').focus(); }
      const key = b.dataset.functionsRun || b.dataset.functionsCopy || b.dataset.functionsDownload;
      if (!key) return;
      const p = window.COURSE_DATA.programs[context.codeLanguage];
      const code = key === 'solution' ? sumSolution(context.codeLanguage) : D.examples[context.codeLanguage][key].code;
      const filename = p.filename || `functions-${key}.${p.ext}`;
      if (b.dataset.functionsRun) window.CodeRunner.open({ language: context.language, codeLanguage: context.codeLanguage, filename, code, label: p.label + ' · Functions' });
      if (b.dataset.functionsCopy) {
        try { await navigator.clipboard.writeText(code); root.querySelector('#functions-code-status').textContent = window.COURSE_DATA.translations[context.language].ui.copied; }
        catch { root.querySelector('#functions-code-status').textContent = window.COURSE_DATA.translations[context.language].ui.copyFailed; }
      }
      if (b.dataset.functionsDownload) {
        const url = URL.createObjectURL(new Blob([code], { type: 'text/plain;charset=utf-8' }));
        const a = document.createElement('a'); a.href = url; a.download = filename; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    });
  }
  window.FunctionsLesson = { render, mount };
})();
