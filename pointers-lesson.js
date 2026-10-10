'use strict';
(() => {
  const D = window.POINTERS_DATA, P = window.CodeVizPointers;
  const { esc, mountQuiz } = window.CodeVizLearningUI;
  const quiz = new window.CodeVizLearning.Quiz(D.questions);
  const store = window.CodeVizLearning.createProgressStore(), lessonId = 'pointers-c-en-v1';
  let context, scenario = 'alias', failAllocation = false, position = 0;
  const pre = code => `<pre tabindex="0" dir="ltr"><code>${esc(code)}</code></pre>`;
  const model = () => P.buildTrace({ scenario, failAllocation });
  function controls(key) {
    return `<div class="controls"><button type="button" data-pointers-run="${key}">Run real code</button><button type="button" data-pointers-copy="${key}">Copy code</button><button type="button" data-pointers-download="${key}">Download code</button></div>`;
  }
  function sample(key) {
    const s = D.samples[key];
    return `<details class="sample"><summary>${esc(s.title)} · C</summary>${controls('sample-' + key)}${pre(s.code)}<h4>Expected output on success</h4><pre class="output" dir="ltr">${esc(s.output.trimEnd())}</pre></details>`;
  }
  function nativeExample() {
    const p = window.COURSE_DATA.programs[context.codeLanguage], ex = D.examples[context.codeLanguage];
    return `<section id="pointers-example"><h2>Selected-language example · ${esc(p.label)}</h2><p>${esc(ex.note)}</p>${controls('native')}${pre(ex.code)}<h3>Expected output on success</h3><pre class="output" dir="ltr">${esc(ex.output.trimEnd())}</pre></section>`;
  }
  function tutorial() {
    return `<nav class="module-outline" aria-label="Pointers lesson sections">${['What is a pointer?', 'Definition and initialization', 'Function arguments', 'Pointers and arrays', 'Dynamic memory allocation'].map((title, i) => `<a class="button" href="#pointers-${i + 1}">9.${i + 1} ${title}</a>`).join('')}<a class="button" href="#pointers-simulation">Simulation</a><a class="button" href="#pointers-quiz">Quiz</a></nav>
      <section id="pointers-1"><h2>9.1 What is a pointer?</h2><p>A pointer is a value that can designate another object, such as an integer or an array element. A <strong>pointer variable</strong> stores that value. Think of it as a note telling the program where to find a value, rather than a second copy of the value itself.</p><p>In C, <code>&amp;value</code> obtains the address of value. When p points to a live, initialized integer, <code>*p</code> accesses that integer. This is called <strong>dereferencing</strong>. Assigning <code>*p = 20</code> changes the integer; assigning <code>p = &amp;other</code> changes where the pointer points.</p><dl class="for-anatomy"><div><dt><code>value</code></dt><dd>The integer object.</dd></div><div><dt><code>&amp;value</code></dt><dd>A pointer to that object.</dd></div><div><dt><code>p</code></dt><dd>The pointer value stored in p.</dd></div><div><dt><code>*p</code></dt><dd>The pointed-to object, when access is valid.</dd></div></dl><p>Pointers help functions modify caller-owned objects, traverse arrays, and manage dynamically allocated storage. Real addresses vary between executions. Our diagrams use symbolic labels and make no assumption about address size or the number of bytes in an int.</p></section>
      <section id="pointers-2"><h2>9.2 Pointer variable definition and initialization</h2>${pre('int value = 10;\nint *p = &value;  // define p and initialize it\n*p = 20;         // value is now 20\nint *unused = NULL; // no object selected yet')}
      <p><code>int *p</code> defines a pointer to int. The star in a declaration describes a type; the star in <code>*p</code> is an operation. Use a compatible pointer type and initialize the pointer before using its value. An ordinary local <code>int *p;</code> has no usable initial value. A null pointer is a deliberate “points to no object” value; checking for NULL does not prove a non-null pointer is otherwise valid.</p><p><code>int *p, q;</code> declares one pointer p and one integer q. Write one declaration per line while learning. To print an object pointer’s address in C, use <code>printf("%p", (void *)p)</code>; never assume an integer format such as %d fits a pointer.</p>${sample('basic')}</section>
      <section id="pointers-3"><h2>9.3 Passing arguments to a function by reference</h2><p><strong>C passes all arguments by value.</strong> It has no C++-style reference parameters. Passing an address lets a function modify the caller’s object through a <em>copy of the pointer</em>, producing reference-like behavior.</p>${pre('void setValue(int *target) {\n    *target = 30; // requires a valid pointer to a writable int\n}\n\nint value = 10;\nsetValue(&value); // caller value becomes 30')}
      <p>The parameter target belongs to the called function, while <code>*target</code> is the caller’s integer. Reassigning target alone would not reassign the caller’s pointer variable. Changing that pointer variable would require returning a new pointer or passing its address with a pointer-to-pointer parameter. Only pass addresses of objects that remain alive for the whole call.</p>${sample('arguments')}</section>
      <section id="pointers-4"><h2>9.4 Pointers and arrays</h2><p>A C array and a pointer are different things. In most expressions an array name converts to a pointer to its first element; important exceptions include sizeof and unary &amp;. An array parameter written as <code>int values[]</code> is adjusted to a pointer parameter. Pass the element count separately.</p>${pre('int values[3] = {10, 20, 30};\nint *p = values;      // same first-element pointer as &values[0]\nprintf("%d\\n", p[1]);       // 20\nprintf("%d\\n", *(p + 1));   // also 20')}
      <p><code>p[i]</code> means <code>*(p + i)</code>. Adding one moves by one element, not by one byte. Pointer arithmetic must stay within the same array or one past its end. You may form the one-past pointer for an end marker, but must never dereference it. C does not automatically check array boundaries.</p><p><code>sizeof values / sizeof values[0]</code> computes a count when values is the actual array object. <code>sizeof p</code> gives the pointer’s size, not its array’s length. Array names cannot be reassigned like pointer variables.</p>${sample('arrays')}</section>
      <section id="pointers-5"><h2>9.5 Pointer dynamic memory allocation</h2><p>Sometimes the required number of elements is known only at runtime. C’s allocation functions in <code>&lt;stdlib.h&gt;</code> provide storage that you release explicitly. The allocated object can outlive the function that obtained it; the pointer variable’s own lifetime is a separate matter.</p><div class="table-wrap"><table><caption>C allocation functions</caption><thead><tr><th scope="col">Function</th><th scope="col">Purpose</th><th scope="col">Remember</th></tr></thead><tbody><tr><td><code>malloc(bytes)</code></td><td>Allocate storage</td><td>Check for NULL; initialize before reading.</td></tr><tr><td><code>calloc(count, size)</code></td><td>Allocate and zero the bytes</td><td>Check for NULL. Zero bytes initialize int elements to zero; this does not promise every possible type’s null representation.</td></tr><tr><td><code>realloc(pointer, bytes)</code></td><td>Resize an allocation</td><td>Use a temporary pointer; initialize any new elements.</td></tr><tr><td><code>free(pointer)</code></td><td>Release allocated storage</td><td>Release each allocation once. NULL is permitted; ordinary local/array addresses are not.</td></tr></tbody></table></div>
      ${pre('size_t count = 3;\nint *values = malloc(count * sizeof *values);\nif (values == NULL) {\n    /* handle the failure before accessing values */\n}\n/* after a successful allocation: initialize, then use */\nfree(values);\nvalues = NULL;')}
      <p>The snippet shows the sequence; the complete runnable example exits on failure. In C, malloc’s void pointer converts to an object pointer without a cast. Use <code>sizeof *values</code> to match the pointed-to type. For a count supplied by a user, validate that it is positive and that the byte-size calculation cannot overflow, for example <code>count &lt;= SIZE_MAX / sizeof *values</code> with SIZE_MAX from &lt;stdint.h&gt;. Our examples use small fixed positive counts.</p>${sample('allocation')}
      <h3>Resize without losing the original allocation</h3><p>For a nonzero requested size, if realloc fails, it returns NULL and the old allocation remains valid. Store its return value in a temporary pointer. On success, use the returned pointer; the old pointer and aliases must not be used, even if the numerical address appears unchanged. Avoid zero-size allocation/reallocation in this beginner lesson.</p>${sample('reallocation')}
      <p>After free, every alias to the released object is unusable. Setting your owner pointer to NULL helps you avoid reusing it; it does not repair other aliases. Losing the last usable pointer before releasing storage causes a <strong>memory leak</strong>. Accessing released storage is <strong>use after free</strong>; releasing it again is a <strong>double free</strong>. C++ typically uses containers or smart pointers to manage ownership automatically; managed languages use their own memory-management rules.</p></section>
      <section id="pointers-simulation"><h2>Follow a pointer and its object’s lifetime</h2><p class="tag">Educational simulation · C</p><p>This model follows the displayed program. It uses symbolic cells, not actual addresses, and never evaluates student code. Compare a pointer to a local integer with an allocated array. The failure option deliberately substitutes NULL to demonstrate the error path.</p><div id="pointers-simulator"></div></section>
      <section><h2>Common mistakes</h2><ul><li>Dereferencing a null, uninitialized, freed, or out-of-range pointer.</li><li>Confusing changing p with changing *p.</li><li>Returning the address of an ordinary local that has gone out of lifetime.</li><li>Using sizeof a pointer to guess an array’s element count.</li><li>Overwriting the only allocation pointer with a failed realloc result.</li><li>Assuming setting one pointer to NULL makes all aliases safe.</li></ul></section>`;
  }
  function exercises() {
    return `<section id="pointers-practice"><h2>Practice in the online editor</h2><p>Run a starter, edit it in the existing editor, and compare the result with the expected output. These exercises are self-checked; there is no automatic grading.</p>${D.exercises.map((e, i) => `<article class="for-challenge"><h3>${i + 1}. ${esc(e.title)}</h3><p>${esc(e.statement)}</p><h4>Expected output on success</h4><pre class="output" dir="ltr">${esc(e.expected.trimEnd())}</pre><button type="button" data-pointers-run="starter-${i}">Open starter in editor</button><details><summary>Hint</summary><p>${esc(e.hint)}</p></details><details><summary>Solution</summary>${pre(e.solution)}<button type="button" data-pointers-run="solution-${i}">Run solution</button></details></article>`).join('')}</section>`;
  }
  function render(c) {
    if (context?.codeLanguage !== c.codeLanguage) position = 0;
    context = c;
    const detailed = c.codeLanguage === 'c';
    return `${c.language !== 'en' || !detailed ? `<p class="notice">${esc(D.locales[c.language][2])}</p>` : ''}<div class="pointers-lesson" lang="en" dir="ltr">${!detailed ? '<p>The detailed pointer tutorial, simulation, and quiz use C. This selected-language example explains its own references and memory management.</p><a class="button" href="index.html?lang=en&amp;code=c#pointers">Open the C pointer lesson · English</a>' : ''}${nativeExample()}${detailed ? tutorial() + '<section id="pointers-quiz" aria-label="C pointers quiz"></section>' + exercises() + '<section aria-label="Pointers lesson progress"><h2>Your progress</h2><p>Completion and quiz scores stay in this browser. No registration or personal information is needed.</p><div id="pointers-progress"></div></section><p class="small">Technical references: <a href="https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf" target="_blank" rel="noopener">C11 draft §§6.3.2.1, 6.5.6, 6.7.6.3 and 7.22.3</a>, <a href="https://learn.microsoft.com/en-us/cpp/c-language/pointer-declarations?view=msvc-170" target="_blank" rel="noopener">pointer declarations</a>, <a href="https://learn.microsoft.com/en-us/cpp/c-runtime-library/reference/realloc?view=msvc-170" target="_blank" rel="noopener">realloc</a>.</p>' : ''}<p id="pointers-code-status" role="status"></p></div>`;
  }
  function draw() {
    const root = document.getElementById('pointers-simulator'); if (!root) return;
    const m = model(), state = m.states[position];
    root.innerHTML = `<div class="controls"><label for="pointers-scenario">Program</label><select id="pointers-scenario"><option value="alias" ${scenario === 'alias' ? 'selected' : ''}>Local integer and function argument</option><option value="allocation" ${scenario === 'allocation' ? 'selected' : ''}>Allocate, initialize and release</option></select>${scenario === 'allocation' ? `<label><input type="checkbox" id="pointers-failure" ${failAllocation ? 'checked' : ''}> Force allocation failure for learning</label>` : ''}</div><div class="for-sim-grid"><div><p id="pointers-step-status" role="status"><strong>Step ${position} / ${m.states.length - 1} · ${esc(state.phase)}</strong><br>${esc(state.message)}</p><dl class="for-metrics"><div><dt>Pointer target</dt><dd>${esc(state.pointer ?? 'NULL / no target')}</dd></div><div><dt>Function parameter’s pointer copy</dt><dd>${esc(state.helperPointer ?? 'Not active')}</dd></div></dl><ol class="pointer-cells" aria-label="Symbolic objects">${state.cells.map(cell => `<li class="${cell.live ? 'live' : 'released'}"><strong>${esc(cell.label)}</strong><span>${cell.live ? cell.value === null ? 'Uninitialized: do not read' : 'Value: ' + cell.value : 'Released / not alive'}</span></li>`).join('')}</ol>${state.cells.length ? '' : '<p>No live object is allocated in the diagram.</p>'}<div class="controls"><button type="button" data-pointers-step="previous" ${position === 0 ? 'disabled' : ''}>Previous</button><button type="button" data-pointers-step="next" ${position === m.states.length - 1 ? 'disabled' : ''}>Next</button><button type="button" data-pointers-step="reset">Reset</button></div><h3>Program output so far</h3><pre class="output" dir="ltr">${esc(state.output || '(no output)')}</pre></div><div><h3>C source · highlighted instruction</h3><pre class="for-source" tabindex="0" dir="ltr"><code>${m.code.trimEnd().split('\n').map((line, i) => `<span class="code-line ${state.line === i ? 'executing' : ''}" ${state.line === i ? 'aria-current="step"' : ''}>${esc(line) || ' '}</span>`).join('')}</code></pre>${controls('simulation')}</div></div>`;
  }
  function drawProgress() {
    const root = document.getElementById('pointers-progress'); if (!root) return;
    const p = store.get(lessonId);
    root.innerHTML = `<p role="status">${p.completed ? 'Lesson marked complete.' : 'Lesson not yet marked complete.'} ${p.latest ? `Latest quiz: ${p.latest.score}/${p.latest.total}. Best: ${p.best.score}/${p.best.total}. Attempts: ${p.attempts}.` : 'No completed quiz yet.'} ${store.isPersistent() ? '' : 'Browser storage is unavailable. Progress is kept for this page session only.'}</p><button type="button" data-pointers-complete>${p.completed ? 'Mark incomplete' : 'Mark lesson complete'}</button>`;
  }
  function source(key) {
    if (key === 'native') return D.examples[context.codeLanguage].code;
    if (key === 'simulation') return model().code;
    if (key.startsWith('sample-')) return D.samples[key.slice(7)].code;
    if (key.startsWith('starter-')) return D.exercises[Number(key.slice(8))].starter;
    if (key.startsWith('solution-')) return D.exercises[Number(key.slice(9))].solution;
    throw new Error('Unknown pointer lesson example.');
  }
  function mount() {
    const root = document.querySelector('.pointers-lesson'); if (!root) return;
    if (context.codeLanguage === 'c') {
      draw(); drawProgress();
      mountQuiz(root.querySelector('#pointers-quiz'), { quiz, id: lessonId, onComplete: result => { store.recordQuiz(lessonId, result); drawProgress(); } });
    }
    root.addEventListener('change', e => {
      if (e.target.id === 'pointers-scenario') { scenario = e.target.value; failAllocation = false; }
      else if (e.target.id === 'pointers-failure') failAllocation = e.target.checked;
      else return;
      position = 0; draw(); root.querySelector('#' + e.target.id)?.focus();
    });
    root.addEventListener('click', async e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.pointersStep) {
        const action = b.dataset.pointersStep;
        position = action === 'reset' ? 0 : Math.max(0, Math.min(model().states.length - 1, position + (action === 'next' ? 1 : -1)));
        draw(); const control = root.querySelector(`[data-pointers-step="${action}"]`);
        if (control.disabled) { const status = root.querySelector('#pointers-step-status'); status.tabIndex = -1; status.focus(); } else control.focus();
      }
      if (b.hasAttribute('data-pointers-complete')) { store.complete(lessonId, !store.get(lessonId).completed); drawProgress(); root.querySelector('[data-pointers-complete]').focus(); }
      const key = b.dataset.pointersRun || b.dataset.pointersCopy || b.dataset.pointersDownload; if (!key) return;
      const p = window.COURSE_DATA.programs[context.codeLanguage], code = source(key), filename = p.filename || `pointers-${key}.${p.ext}`;
      if (b.dataset.pointersRun) window.CodeRunner.open({ language: context.language, codeLanguage: context.codeLanguage, code, filename, label: p.label + ' · Pointers' });
      if (b.dataset.pointersCopy) {
        try { await navigator.clipboard.writeText(code); root.querySelector('#pointers-code-status').textContent = window.COURSE_DATA.translations[context.language].ui.copied; }
        catch { root.querySelector('#pointers-code-status').textContent = window.COURSE_DATA.translations[context.language].ui.copyFailed; }
      }
      if (b.dataset.pointersDownload) {
        const url = URL.createObjectURL(new Blob([code], { type: 'text/plain;charset=utf-8' }));
        const a = document.createElement('a'); a.href = url; a.download = filename; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    });
  }
  window.PointersLesson = { render, mount };
})();
