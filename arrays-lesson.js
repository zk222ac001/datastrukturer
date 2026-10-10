'use strict';
(() => {
  const D = window.ARRAYS_DATA;
  const { esc, mountQuiz } = window.CodeVizLearningUI;
  const A = window.CodeVizArrays;
  const quiz = new window.CodeVizLearning.Quiz(D.questions);
  const progress = window.CodeVizLearning.createProgressStore();
  let context, values = A.createValues(), mode = 'full', selected = 0, reverse = false, position = 0, message = 'Select a cell or read an index to inspect its value.';
  const title = language => D.locales[language][0];
  const pre = code => `<pre dir="ltr" tabindex="0"><code>${esc(code)}</code></pre>`;
  const runnable = () => values.every(v => v !== null);
  function declaration() {
    if (values.some(v => v === null)) return `int values[5];\n${values.map((v, i) => v === null ? '' : `values[${i}] = ${v};`).filter(Boolean).join('\n')}`;
    return `int values[5] = {${values.join(', ')}};`;
  }
  function traversalParts() {
    return reverse ? ['int i = 4', 'i >= 0', '--i'] : ['int i = 0', 'i < 5', '++i'];
  }
  function simulationSource() {
    const parts = traversalParts();
    return `#include <stdio.h>\n\nint main(void) {\n    ${declaration().replaceAll('\n', '\n    ')}\n    for (${parts.join('; ')}) {\n        printf("%d\\n", values[i]);\n    }\n    return 0;\n}\n`;
  }
  function tutorial() {
    return `<section id="arrays-tutorial" aria-labelledby="arrays-tutorial-title"><h3 id="arrays-tutorial-title">A row of values under one name</h3><p>Imagine five temperature readings. Separate variables make repeating the same calculation awkward. An array gives the readings one name and numbered positions. In C, its elements share a type and occupy neighboring memory locations. Its length stays unchanged throughout its lifetime.</p>${pre('int readings[5] = {4, 8, 12, 16, 20};\n// type  name   count        starting values\nprintf("%d\\n", readings[0]); // first element: 4\nreadings[2] = 99;            // change the third element')}
    <dl class="for-anatomy"><div><dt>Declare</dt><dd><code>int readings[5];</code> reserves space for five integers. The declaration alone does not give an ordinary local array’s elements usable values.</dd></div><div><dt>Initialize</dt><dd><code>int readings[5] = {4, 8};</code> starts with 4 and 8; the three remaining elements become zero. <code>{0}</code> initializes every element to zero.</dd></div><div><dt>Read</dt><dd><code>readings[2]</code> selects the third element. The first index is 0, and the last index is length − 1. A five-element array ends at index 4.</dd></div><div><dt>Update</dt><dd><code>readings[2] = 99;</code> changes one slot. It neither inserts a new element nor changes the array’s length.</dd></div></dl>
    <p>Assign each element of an uninitialized local array before reading it. Arrays with static storage duration are zero-initialized when no explicit initializer is supplied. You can also let C infer the length from an initializer: <code>int readings[] = {4, 8, 12};</code> creates three elements. Too many initializers for an explicitly sized array violate C’s constraints.</p>
    <h4>Visit each element with a loop</h4>${pre('size_t count = sizeof readings / sizeof readings[0];\nfor (size_t i = 0; i < count; ++i) {\n    printf("%d\\n", readings[i]);\n}')}
    <p>The loop uses the counter as an index. Keep <code>i &lt; count</code> so the final access is at count − 1. To visit five elements in reverse, a signed counter can run from 4 down to 0.</p>
    <div class="table-wrap"><table><caption>Forward traversal after changing readings[2] to 99</caption><thead><tr><th scope="col">Index i</th><th scope="col">Condition i &lt; 5</th><th scope="col">Value printed</th></tr></thead><tbody>${[4, 8, 99, 16, 20].map((v, i) => `<tr><td>${i}</td><td>true</td><td>${v}</td></tr>`).join('')}<tr><td>5</td><td>false</td><td>No access; leave the loop</td></tr></tbody></table></div>
    <h4>Element count and memory size</h4><p><code>sizeof readings</code> gives this array’s total size in bytes. Dividing by <code>sizeof readings[0]</code> gives its element count. Use <code>size_t</code> for the result and <code>%zu</code> to print it. Do not assume an <code>int</code> is always four bytes. The cell offsets in our diagram use multiples of <code>sizeof(int)</code>, not real addresses.</p><p>This count formula needs the actual array object. A function parameter declared as <code>int readings[]</code> is adjusted to a pointer; its <code>sizeof</code> is not the caller’s array size. Pass the element count separately.</p>
    <h4>Common mistakes</h4><ul><li>Using index 5 for five elements: C does not automatically check the boundary; out-of-range access has undefined behavior.</li><li>Reading an uninitialized local element and expecting zero. Zero-fill comes from an initializer or static storage, not from every declaration.</li><li>Using <code>i &lt;= count</code> instead of <code>i &lt; count</code>.</li><li>Trying to assign a new initializer list to an existing C array. Update its elements individually, or copy them with an appropriate operation.</li></ul>
    <h4>Beyond one dimension</h4>${pre('int grid[2][3] = {{1, 2, 3}, {4, 5, 6}};\nprintf("%d\\n", grid[1][2]); // row 1, column 2: prints 6')}
    <p>A two-dimensional array is an array of rows. Each index has its own boundary. This grid has two rows and three columns; <code>grid[1][2]</code> picks the second row’s third element.</p><h4>Use it in real programs</h4><p>Store sensor readings, count votes in fixed categories, or record scores for a group. A traversal can calculate a sum, find a largest reading, or search for a value. Choose a different structure when the number of items needs to grow.</p>
    <p class="small">Reading guide: <a href="https://www.geeksforgeeks.org/c/c-arrays/" target="_blank" rel="noopener">GeeksforGeeks: Arrays in C</a>. CodeViz uses original text, examples and diagrams. Technical references: <a href="https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf" target="_blank" rel="noopener">C11 draft §§6.2.5, 6.5.2.1, 6.5.3.4, 6.7.9</a>, <a href="https://learn.microsoft.com/en-us/cpp/c-language/array-declarations?view=msvc-170" target="_blank" rel="noopener">array declarations</a>, <a href="https://learn.microsoft.com/en-us/cpp/c-language/initializing-aggregate-types?view=msvc-170" target="_blank" rel="noopener">initialization</a>.</p></section>`;
  }
  function example(c) {
    const ex = D.examples[c.codeLanguage], p = window.COURSE_DATA.programs[c.codeLanguage];
    return `<section class="arrays-example" lang="en" dir="ltr"><h3>Arrays and indexed collections · ${esc(p.label)}</h3><p>${esc(ex.note)}</p><div class="controls"><button type="button" data-arrays-example="run">${esc(window.ModuleOne.ui(c.language, 'runner'))}</button><button type="button" data-arrays-example="copy">${esc(window.COURSE_DATA.translations[c.language].ui.copy)}</button><button type="button" data-arrays-example="download">${esc(window.COURSE_DATA.translations[c.language].ui.download)}</button></div>${pre(ex.code)}<h4>Expected output</h4>${pre(D.output)}<p id="arrays-example-status" role="status"></p></section>`;
  }
  function render(c) {
    context = c;
    const note = c.language !== 'en' || c.codeLanguage !== 'c' ? `<p class="notice">${esc(D.locales[c.language][2])}</p>` : '';
    if (c.codeLanguage !== 'c') return `${note}<a class="button" href="?lang=${encodeURIComponent(c.language)}&amp;code=c#arrays">C · English</a><div class="arrays-lesson">${example(c)}</div>`;
    return `${note}<div class="arrays-lesson" lang="en" dir="ltr"><p class="eyebrow">Interactive lesson · C · English</p><nav class="controls" aria-label="Arrays lesson sections"><a href="#arrays-simulation">Explore</a><a href="#arrays-tutorial">Learn</a><a href="#arrays-quiz">Quiz</a><a href="#arrays-practice">Practice</a></nav><section id="arrays-simulation" aria-labelledby="arrays-simulation-title"><h3 id="arrays-simulation-title">Explore five neighboring cells</h3><p class="tag">Educational simulation</p><p>Inspect an index, replace a value, then trace a traversal. This bounded model does not execute C code or expose real memory. It blocks unsafe reads instead of guessing what an invalid C program would print.</p><div id="arrays-explorer"></div></section>${tutorial()}${example(c)}<section id="arrays-quiz" aria-label="C arrays quiz"></section><section id="arrays-practice" aria-labelledby="arrays-practice-title"><h3 id="arrays-practice-title">Practice with real C code</h3><p>Open a starter in the existing OneCompiler editor, edit it and press Run. Compare with the expected output yourself; these challenges do not provide automatic grading.</p>${D.exercises.map(ex => `<article class="for-challenge"><h4>${esc(ex.title)}</h4><p>${esc(ex.problem)}</p><h5>Expected output</h5>${pre(ex.expected)}<button type="button" data-arrays-starter="${ex.id}">Open C starter in editor</button><details><summary>Hint</summary><p>${esc(ex.hint)}</p></details><details><summary>Solution</summary>${pre(ex.solution)}<button type="button" data-arrays-solution="${ex.id}">Run C solution</button></details></article>`).join('')}</section><section aria-label="Arrays lesson progress"><h3>Your progress</h3><p>Only this browser stores your completion marker and quiz results. No account or personal information is needed. Clearing browser storage removes saved progress.</p><div id="arrays-progress"></div></section></div>`;
  }
  function drawExplorer() {
    const root = document.getElementById('arrays-explorer');
    if (!root) return;
    const trace = runnable() ? A.traversalTrace(values, reverse) : [], s = trace[position];
    const parts = traversalParts();
    const mark = (phase, text) => `<span ${s?.phase === phase ? 'class="executing" aria-current="step"' : ''}>${esc(text)}</span>`;
    const stateText = !s ? 'Traversal is blocked until every element has a value.' : {
      ready: 'Ready. No traversal step has executed yet.', initialize: `Initialize i to ${s.index}.`,
      condition: `Check ${s.index} ${reverse ? '>= 0' : '< 5'}: ${s.condition}. ${s.condition ? 'Read that element next.' : 'Stop without accessing this index.'}`,
      read: `Read values[${s.index}] and print ${values[s.index]}.`, update: `Move the index to ${s.index}.`, terminate: 'The traversal ended safely after a false condition.'
    }[s.phase];
    root.innerHTML = `<div class="controls"><label for="arrays-mode">Initialization</label><select id="arrays-mode"><option value="full" ${mode === 'full' ? 'selected' : ''}>All values: {4, 8, 12, 16, 20}</option><option value="partial" ${mode === 'partial' ? 'selected' : ''}>Partial: {4, 8}</option><option value="uninitialized" ${mode === 'uninitialized' ? 'selected' : ''}>Local array without initializer</option></select><button type="button" data-arrays-reset>Reset array</button></div><p class="small">Changing initialization or a value resets the traversal. Unknown cells are marked “?”, never zero.</p><div class="array-cells" dir="ltr" role="group" aria-label="Five array elements">${values.map((v, i) => `<button type="button" class="array-cell ${selected === i ? 'selected' : ''} ${s?.activeIndex === i ? 'visited' : ''}" data-array-index="${i}" aria-pressed="${selected === i}" aria-label="Index ${i}, ${v === null ? 'uninitialized' : 'value ' + v}"><span>index ${i}</span><strong>${v === null ? '?' : v}</strong><small>+${i} × sizeof(int)</small></button>`).join('')}</div><p class="small">Symbolic offsets from the first element; real int sizes and addresses depend on the implementation.</p><form id="arrays-access" class="controls"><label>Index <input id="arrays-index" name="index" type="number" min="-1" max="5" step="1" value="${selected}" required></label><label>New value <input name="value" type="number" min="-100" max="100" step="1" value="${values[selected] ?? 0}"></label><button type="submit" value="read">Read element</button><button type="submit" value="write">Update element</button></form><p id="arrays-access-status" role="status">${esc(message)}</p><label for="arrays-direction">Traversal direction</label> <select id="arrays-direction"><option value="forward" ${!reverse ? 'selected' : ''}>Forward</option><option value="reverse" ${reverse ? 'selected' : ''}>Reverse</option></select><div class="for-sim-grid"><div><p id="arrays-step-status" role="status"><strong>${s ? `Step ${position} / ${trace.length - 1} · ${s.phase}` : 'Not ready'}</strong><br>${esc(stateText)}</p><dl class="for-metrics"><div><dt>Current index i</dt><dd>${!s || s.phase === 'ready' ? 'Not initialized' : s.phase === 'terminate' ? 'Out of scope' : s.index}</dd></div><div><dt>Condition</dt><dd>${s?.condition == null ? 'Not evaluated this step' : s.condition}</dd></div><div><dt>Printed elements</dt><dd>${s?.iterations ?? 0}</dd></div></dl><div class="controls"><button type="button" data-arrays-step="previous" ${!s || position === 0 ? 'disabled' : ''}>Previous</button><button type="button" data-arrays-step="next" ${!s || position === trace.length - 1 ? 'disabled' : ''}>Next</button><button type="button" data-arrays-step="reset">Reset traversal</button></div><h4>Program output</h4><pre class="output" dir="ltr">${esc(s?.output || '(no output)')}</pre></div><div><h4>C source · highlighted instruction</h4><pre class="for-source" dir="ltr" tabindex="0"><code>${esc('#include <stdio.h>\n\nint main(void) {\n    ' + declaration().replaceAll('\n', '\n    ') + '\n    for (')}${mark('initialize', parts[0])}; ${mark('condition', parts[1])}; ${mark('update', parts[2])}) {
        ${mark('read', 'printf("%d\\n", values[i]);')}
    }
    ${mark('terminate', 'return 0;')}
}</code></pre><button type="button" data-arrays-simulation-run ${!runnable() ? 'disabled' : ''}>Run this C example in editor</button><p class="small">The source above shows the current simulated values. The editor button is enabled only when all reads have initialized values.</p></div></div>`;
  }
  function drawProgress() {
    const root = document.getElementById('arrays-progress'); if (!root) return;
    const p = progress.get(D.id);
    root.innerHTML = `<p role="status">${p.completed ? 'Lesson marked complete.' : 'Lesson not yet marked complete.'} ${p.latest ? `Latest quiz: ${p.latest.score}/${p.latest.total}. Best: ${p.best.score}/${p.best.total}. Attempts: ${p.attempts}.` : 'No completed quiz yet.'} ${progress.isPersistent() ? '' : 'Browser storage is unavailable. Progress is kept for this page session only.'}</p><button type="button" data-arrays-complete>${p.completed ? 'Mark incomplete' : 'Mark lesson complete'}</button>`;
  }
  function open(code, name, codeLanguage = 'c') {
    const p = window.COURSE_DATA.programs[codeLanguage];
    window.CodeRunner.open({ language: context.language, codeLanguage, code, filename: p.filename || name + '.' + p.ext, label: p.label + ' · Arrays' });
  }
  function reset() {
    values = A.createValues(5, mode === 'uninitialized' ? null : mode === 'partial' ? [4, 8] : [4, 8, 12, 16, 20]);
    selected = 0; position = 0; message = 'Array reset. Select an element to inspect it.';
  }
  function focusExplorer(selector) { document.querySelector('#arrays-explorer ' + selector)?.focus(); }
  function mount() {
    const root = document.querySelector('.arrays-lesson'); if (!root) return;
    if (context.codeLanguage === 'c') {
      drawExplorer(); drawProgress();
      mountQuiz(root.querySelector('#arrays-quiz'), { quiz, id: D.id, onComplete: result => { progress.recordQuiz(D.id, result); drawProgress(); } });
      root.querySelector('#arrays-explorer').addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData(e.target), raw = form.get('value'), index = Number(form.get('index'));
        try {
          if (e.submitter?.value === 'write') {
            if (raw.trim() === '') throw new Error('Enter a new value before updating.');
            values = A.write(values, index, Number(raw)); position = 0; message = `Updated values[${index}] to ${values[index]}.`;
          } else message = `values[${index}] = ${A.read(values, index)}.`;
          selected = index;
        } catch (error) { message = error.message; }
        drawExplorer(); focusExplorer('#arrays-index');
      });
      root.addEventListener('change', e => {
        if (e.target.id === 'arrays-mode') { mode = e.target.value; reset(); drawExplorer(); focusExplorer('#arrays-mode'); }
        if (e.target.id === 'arrays-direction') { reverse = e.target.value === 'reverse'; position = 0; drawExplorer(); focusExplorer('#arrays-direction'); }
      });
    }
    root.addEventListener('click', async e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-array-index')) {
        selected = Number(b.dataset.arrayIndex);
        try { message = `values[${selected}] = ${A.read(values, selected)}.`; } catch (error) { message = error.message; }
        drawExplorer(); focusExplorer(`[data-array-index="${selected}"]`);
      }
      if (b.hasAttribute('data-arrays-reset')) { reset(); drawExplorer(); focusExplorer('[data-arrays-reset]'); }
      if (b.dataset.arraysStep) {
        const action = b.dataset.arraysStep;
        const trace = runnable() ? A.traversalTrace(values, reverse) : [];
        position = action === 'reset' ? 0 : Math.max(0, Math.min(trace.length - 1, position + (action === 'next' ? 1 : -1)));
        drawExplorer();
        const control = root.querySelector(`[data-arrays-step="${action}"]`);
        if (control.disabled) { const status = root.querySelector('#arrays-step-status'); status.tabIndex = -1; status.focus(); } else control.focus();
      }
      if (b.hasAttribute('data-arrays-simulation-run') && runnable()) open(simulationSource(), 'arrays-simulation');
      if (b.dataset.arraysStarter || b.dataset.arraysSolution) {
        const ex = D.exercises.find(ex => ex.id === (b.dataset.arraysStarter || b.dataset.arraysSolution));
        if (ex) open(b.dataset.arraysSolution ? ex.solution : ex.starter, ex.id);
      }
      if (b.hasAttribute('data-arrays-complete')) { progress.complete(D.id, !progress.get(D.id).completed); drawProgress(); root.querySelector('[data-arrays-complete]').focus(); }
      if (b.dataset.arraysExample) {
        const code = D.examples[context.codeLanguage].code, p = window.COURSE_DATA.programs[context.codeLanguage];
        const action = b.dataset.arraysExample;
        if (action === 'run') open(code, 'arrays', context.codeLanguage);
        if (action === 'copy') {
          try { await navigator.clipboard.writeText(code); root.querySelector('#arrays-example-status').textContent = window.COURSE_DATA.translations[context.language].ui.copied; }
          catch { root.querySelector('#arrays-example-status').textContent = window.COURSE_DATA.translations[context.language].ui.copyFailed; }
        }
        if (action === 'download') {
          const url = URL.createObjectURL(new Blob([code], { type: 'text/plain;charset=utf-8' }));
          const a = document.createElement('a'); a.href = url; a.download = p.filename || 'arrays.' + p.ext; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
      }
    });
  }
  window.ArraysLesson = { title, render, mount };
})();
