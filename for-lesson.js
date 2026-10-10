'use strict';
(() => {
  const { loopTrace, Quiz, createProgressStore } = window.CodeVizLearning;
  const { esc, mountQuiz } = window.CodeVizLearningUI;
  const data = window.FOR_LESSON_DATA;
  const quiz = new Quiz(data.questions), progress = createProgressStore();
  let context, position = 0, config = { start: 1, end: 5, step: 1 };
  const fallback = {
    da: 'Den nye interaktive lektion er tilgængelig på engelsk og i C. De eksisterende eksempler følger dit valgte programmeringssprog.',
    en: 'The new interactive lesson is available in English and C. Existing examples follow your selected programming language.',
    es: 'La nueva lección interactiva está disponible en inglés y C. Los ejemplos existentes usan el lenguaje de programación seleccionado.',
    fr: 'La nouvelle leçon interactive est disponible en anglais et en C. Les exemples existants utilisent le langage de programmation sélectionné.',
    de: 'Die neue interaktive Lektion ist auf Englisch und in C verfügbar. Bestehende Beispiele verwenden die gewählte Programmiersprache.',
    pt: 'A nova lição interativa está disponível em inglês e C. Os exemplos existentes usam a linguagem de programação selecionada.',
    ar: 'الدرس التفاعلي الجديد متاح باللغة الإنجليزية ولغة C. تستخدم الأمثلة الحالية لغة البرمجة التي اخترتها.',
    ur: 'نیا تعاملی سبق انگریزی اور C میں دستیاب ہے۔ موجودہ مثالیں آپ کی منتخب کردہ پروگرامنگ زبان استعمال کرتی ہیں۔',
    hi: 'नया इंटरैक्टिव पाठ अंग्रेज़ी और C में उपलब्ध है। मौजूदा उदाहरण आपकी चुनी हुई प्रोग्रामिंग भाषा में हैं।',
    zh: '新的交互式课程目前提供英语和 C 语言版本。现有示例使用您选择的编程语言。'
  };
  function source() {
    return `#include <stdio.h>\n\nint main(void) {\n    for (int i = ${config.start}; i ${config.step > 0 ? '<=' : '>='} ${config.end}; i += ${config.step}) {\n        printf("%d\\n", i);\n    }\n    return 0;\n}\n`;
  }
  function tutorial() {
    const rows = loopTrace({ start: 1, end: 3, step: 1 }).filter(s => !['ready', 'terminate'].includes(s.phase));
    return `<section aria-labelledby="for-tutorial-title"><h3 id="for-tutorial-title">One instruction, repeated with a plan</h3><p>A loop repeats a block of instructions. Use a <code dir="ltr">for</code> loop when you can describe a starting value, a stopping rule, and how to move to the next value. Here we print the numbers 1 through 3.</p><pre dir="ltr" tabindex="0"><code>${esc('#include <stdio.h>\n\nint main(void) {\n    // Start once; check before each body; update after each body.\n    for (int i = 1; i <= 3; ++i) {\n        printf("%d\\n", i); // Body: print the current counter.\n    }\n    return 0;\n}')}</code></pre><dl class="for-anatomy"><div><dt>1. Initialize: <code>int i = 1</code></dt><dd>Create the counter i and start at 1. This happens only once.</dd></div><div><dt>2. Check: <code>i &lt;= 3</code></dt><dd>If the condition is true, run the body. If it is false, leave the loop—even on the first check.</dd></div><div><dt>3. Execute the body</dt><dd><code>printf</code> prints the current i. The braces group the instructions to repeat. <code>&#92;n</code> in the string starts a new output line.</dd></div><div><dt>4. Update: <code>++i</code></dt><dd>Add one, then return to the condition check. <code>i += 1</code> does the same job here.</dd></div></dl><p>The order is initialize → check → body → update → check again. The condition is a rule, not a repetition count. The counter declared in this loop header is only available inside this loop.</p><div class="table-wrap"><table><caption>Execution table: start 1, end 3, step +1 (values after each step)</caption><thead><tr><th scope="col">Step</th><th scope="col">Counter i</th><th scope="col">Condition</th><th scope="col">Completed iterations</th><th scope="col">Output so far</th></tr></thead><tbody>${rows.map(s => `<tr><th scope="row">${esc(s.phase)}</th><td>${s.counter}</td><td>${s.condition === null ? '—' : s.condition}</td><td>${s.iterations}</td><td><code dir="ltr">${esc(s.output.trim().replaceAll('\n', ', ') || '—')}</code></td></tr>`).join('')}</tbody></table></div><h4>Common mistakes</h4><ul><li><strong>One too many or too few:</strong> <code>i &lt; 3</code> excludes 3; <code>i &lt;= 3</code> includes it. Trace the first and last values.</li><li><strong>A stray semicolon:</strong> <code>for (...);</code> has an empty body. Do not put a semicolon between the header and its opening brace.</li><li><strong>Moving away from the stopping point:</strong> counting upward with <code>i &gt;= 1</code> may never stop. Match the update direction and condition.</li><li><strong>Resetting a total in the body:</strong> declare an accumulator before the loop so it keeps previous additions.</li></ul><h4>Where this helps</h4><p>Print one ticket per seat, visit each item in a shopping list, or add daily sales into a weekly total. For an array with n items, indices usually run from 0 through n − 1: <code>i = 0; i &lt; n; ++i</code>. A countdown instead uses a decreasing counter.</p></section>`;
  }
  function render(c) {
    context = c;
    const notice = `<p class="notice">${esc(fallback[c.language])}</p>`;
    if (c.codeLanguage !== 'c') return `${notice}<a class="button" href="?lang=${encodeURIComponent(c.language)}&amp;code=c#counter">${esc(window.COURSE_DATA.programs.c.label)} · English</a>`;
    return `${c.language !== 'en' ? notice : ''}<div class="for-lesson" lang="en" dir="ltr"><p class="eyebrow">Interactive lesson · C · English</p><nav class="controls" aria-label="Lesson sections"><a href="#for-simulation">Explore</a><a href="#for-tutorial-title">Learn</a><a href="#for-quiz">Quiz</a><a href="#for-practice">Practice</a></nav><section id="for-simulation" aria-labelledby="for-simulation-title"><h3 id="for-simulation-title">Watch the loop, one step at a time</h3><p class="tag">Educational simulation</p><p>This model illustrates a bounded C loop; it does not compile or execute your code. Each step shows the state after the highlighted instruction. Change the values to explore counting up, counting down, or zero iterations.</p><form id="for-config" class="controls"><label>Start <input name="start" type="number" min="-100" max="100" step="1" value="${config.start}" required></label><label>End (inclusive) <input name="end" type="number" min="-100" max="100" step="1" value="${config.end}" required></label><label>Step <input name="step" type="number" min="-100" max="100" step="1" value="${config.step}" required></label><button type="submit">Apply and reset</button></form><p class="small">Whole numbers −100 to 100. Step must be nonzero. Positive steps use ≤; negative steps use ≥.</p><p id="for-config-error" role="alert"></p><div id="for-trace"></div></section>${tutorial()}<section id="for-quiz" aria-label="C for loop quiz"></section><section id="for-practice" aria-labelledby="for-practice-title"><h3 id="for-practice-title">Practice in the online editor</h3><p>Open a starter program, edit it in OneCompiler, and press Run. Compare your output with the expected output below, including the zero case. These challenges are self-checked; CodeViz does not automatically grade your code. The editor loads only when you request it.</p>${data.exercises.map(ex => `<article class="for-challenge"><h4>${esc(ex.title)}</h4><p>${esc(ex.problem)}</p><p><strong>Example:</strong> ${esc(ex.example)}</p><h5>Expected output</h5><pre dir="ltr">${esc(ex.expected)}</pre><button type="button" data-for-editor="${ex.id}">Open C starter in editor</button><details><summary>Hint</summary><p>${esc(ex.hint)}</p></details><details><summary>Solution and explanation</summary><pre tabindex="0" dir="ltr"><code>${esc(ex.solution)}</code></pre><p>${esc(ex.explanation)}</p><button type="button" data-for-solution="${ex.id}">Run C solution</button></details></article>`).join('')}</section><section aria-label="Lesson progress"><h3>Your progress</h3><p>Progress is stored only in this browser. No account or personal information is needed. Clearing browser storage removes saved progress.</p><div id="for-progress"></div></section></div>`;
  }
  function drawTrace() {
    const root = document.getElementById('for-trace');
    if (!root) return;
    const states = loopTrace(config), s = states[position];
    const mark = (phase, text) => `<span ${s.phase === phase ? 'class="executing" aria-current="step"' : ''}>${esc(text)}</span>`;
    const explanations = {
      ready: 'Ready. No loop instruction has executed yet.',
      initialize: `Initialize i to ${config.start}. This runs once.`,
      condition: `Check ${s.counter} ${config.step > 0 ? '<=' : '>='} ${config.end}: ${s.condition}. ${s.condition ? 'The body runs next.' : 'Leave the loop; skip the body and update.'}`,
      body: `Print ${s.counter}. ${s.iterations} iteration(s) have completed.`,
      update: `Add ${config.step} to i. Now i is ${s.counter}; check the condition again next.`,
      terminate: 'The loop has ended after a false condition. Execute return 0 to finish the program. The loop-local i is now out of scope.'
    };
    root.innerHTML = `<div class="for-sim-grid"><div><p id="for-step-status" role="status"><strong>Step ${position} / ${states.length - 1} · ${esc(s.phase)}</strong><br>${esc(explanations[s.phase])}</p><dl class="for-metrics"><div><dt>Counter i</dt><dd>${s.phase === 'ready' ? 'Not initialized' : s.phase === 'terminate' ? 'Out of scope' : s.counter}</dd></div><div><dt>Condition result</dt><dd>${s.condition === null ? 'Not evaluated this step' : s.condition}</dd></div><div><dt>Completed iterations</dt><dd>${s.iterations}</dd></div></dl><div class="controls"><button type="button" data-for-step="previous" ${position === 0 ? 'disabled' : ''}>Previous</button><button type="button" data-for-step="next" ${position === states.length - 1 ? 'disabled' : ''}>Next</button><button type="button" data-for-step="reset">Reset</button></div><h4>Program output</h4><pre class="output" dir="ltr">${esc(s.output || '(no output)')}</pre></div><div><h4>C source · highlighted instruction</h4><pre class="for-source" dir="ltr" tabindex="0"><code>${esc('#include <stdio.h>\n\nint main(void) {\n    for (')}${mark('initialize', `int i = ${config.start}`)}; ${mark('condition', `i ${config.step > 0 ? '<=' : '>='} ${config.end}`)}; ${mark('update', `i += ${config.step}`)}) {
        ${mark('body', 'printf("%d\\n", i);')}
    }
    ${mark('terminate', 'return 0;')}
}</code></pre><button type="button" data-for-run>Run this C example in editor</button></div></div>`;
  }
  function drawProgress() {
    const root = document.getElementById('for-progress');
    if (!root) return;
    const p = progress.get(data.id);
    root.innerHTML = `<p role="status">${p.completed ? 'Lesson marked complete.' : 'Lesson not yet marked complete.'} ${p.latest ? `Latest quiz: ${p.latest.score}/${p.latest.total}. Best: ${p.best.score}/${p.best.total}. Attempts: ${p.attempts}.` : 'No completed quiz yet.'} ${progress.isPersistent() ? '' : 'Browser storage is unavailable. Progress is kept for this page session only.'}</p><button type="button" data-for-complete>${p.completed ? 'Mark incomplete' : 'Mark lesson complete'}</button>`;
  }
  function openEditor(code, filename, label) {
    window.CodeRunner.open({ language: context.language, codeLanguage: 'c', code, filename, label });
  }
  function mount() {
    const root = document.querySelector('.for-lesson');
    if (!root) return;
    drawTrace(); drawProgress();
    mountQuiz(root.querySelector('#for-quiz'), { quiz, id: data.id, onComplete: result => { progress.recordQuiz(data.id, result); drawProgress(); } });
    root.querySelector('#for-config').addEventListener('submit', e => {
      e.preventDefault();
      const form = new FormData(e.target);
      const next = Object.fromEntries(['start', 'end', 'step'].map(k => [k, Number(form.get(k))]));
      try {
        loopTrace(next); config = next; position = 0;
        root.querySelector('#for-config-error').textContent = '';
        drawTrace();
      } catch (error) { root.querySelector('#for-config-error').textContent = error.message; }
    });
    root.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.forStep) {
        const action = b.dataset.forStep;
        position = action === 'reset' ? 0 : Math.max(0, Math.min(loopTrace(config).length - 1, position + (action === 'next' ? 1 : -1)));
        drawTrace();
        const control = root.querySelector(`[data-for-step="${action}"]`);
        if (control.disabled) { const status = root.querySelector('#for-step-status'); status.tabIndex = -1; status.focus(); } else control.focus();
      }
      if (b.hasAttribute('data-for-run')) openEditor(source(), 'for-loop.c', 'C · For loop');
      const id = b.dataset.forEditor || b.dataset.forSolution;
      if (id) { const ex = data.exercises.find(x => x.id === id); if (ex) openEditor(b.dataset.forSolution ? ex.solution : ex.starter, ex.id + '.c', 'C · ' + ex.title); }
      if (b.hasAttribute('data-for-complete')) { progress.complete(data.id, !progress.get(data.id).completed); drawProgress(); root.querySelector('[data-for-complete]').focus(); }
    });
  }
  window.ForLesson = { render, mount };
})();
