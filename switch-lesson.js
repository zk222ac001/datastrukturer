'use strict';
(() => {
  const D = window.SWITCH_DATA, S = window.CodeVizSwitch;
  const { esc, mountQuiz } = window.CodeVizLearningUI;
  const store = window.CodeVizLearning.createProgressStore(), quizzes = new Map();
  let context, choice = 2, breakAfterFirst = true, includeDefault = true, position = 0;
  const id = () => 'switch-' + context.codeLanguage + '-en-v1';
  const model = () => S.build({ language: context.codeLanguage, choice, breakAfterFirst, includeDefault });
  function questions(language) {
    const special = language === 'python' ? {
      prompt: 'Does a matching Python case automatically run the next case?', options: ['Yes', 'No', 'Only for integers', 'Only with case _'], answer: 1, explanation: 'Python match/case does not fall through. A matching case executes its block and then leaves the match statement.'
    } : language === 'csharp' ? {
      prompt: 'Can a nonempty C# switch section implicitly fall into the next section?', options: ['Yes', 'No', 'Only for case 1', 'Only with default'], answer: 1, explanation: 'C# requires a valid control transfer at the end of a nonempty switch section. The sample uses break.'
    } : {
      prompt: 'What happens if choice is 1 and the break after Start is removed in this example?', options: ['Only Start prints', 'Start and Help print', 'Only Help prints', 'No message prints'], answer: 1, explanation: 'Execution starts in case 1 and continues into case 2, even though choice is not 2. The break in case 2 then leaves the switch.'
    };
    return [
      { prompt: 'When is this kind of selection useful?', options: ['Repeating an action a fixed number of times', 'Choosing an action from a menu value', 'Declaring an array', 'Adding every value in a list'], answer: 1, explanation: 'A menu choice selects one action. An if/else chain is usually clearer for ranges or unrelated conditions.' },
      { prompt: 'With choice = 2, which case-body message is printed before After selection?', options: ['Start', 'Help', 'Unknown choice', 'All three'], answer: 1, explanation: 'The literal case 2 matches the numeric choice, so its body prints Help.' },
      { prompt: `With choice = 3, which label provides the fallback in this example?`, options: ['case 1', 'case 2', language === 'python' ? 'case _' : 'default', 'break'], answer: 2, explanation: 'No numbered case matches 3. The fallback handles this otherwise unmatched value.' },
      special,
      { prompt: 'With choice = 3 and the fallback removed, what prints?', options: ['Start', 'Help', 'Unknown choice', 'After selection'], answer: 3, explanation: 'No case body runs, but execution continues after the selection statement and prints After selection.' }
    ];
  }
  function quiz() {
    if (!quizzes.has(id())) quizzes.set(id(), new window.CodeVizLearning.Quiz(questions(context.codeLanguage)));
    return quizzes.get(id());
  }
  function render(c) {
    if (context?.codeLanguage !== c.codeLanguage) position = 0;
    context = c;
    if (!S.canFallThrough(c.codeLanguage)) breakAfterFirst = true;
    const python = c.codeLanguage === 'python', fallback = python ? 'case _' : 'default';
    return `${c.language !== 'en' ? `<p class="notice">${esc(D.locales[c.language][2])}</p>` : ''}<div class="switch-lesson" lang="en" dir="ltr"><p class="eyebrow">Interactive lesson · ${esc(window.COURSE_DATA.programs[c.codeLanguage].label)}</p><p class="notice">${esc(D.notes[c.codeLanguage])}</p><section aria-labelledby="switch-explain"><h3 id="switch-explain">One value, several possible actions</h3><p>A menu can offer 1 for Start and 2 for Help. A ${python ? 'match' : 'switch'} statement chooses a starting branch from one value. Use <code>if/else</code> when you need ranges such as score ≥ 50, or several unrelated conditions.</p><dl class="for-anatomy"><div><dt>Selector: <code>choice</code></dt><dd>The value used to decide where execution begins. This example uses a small integer.</dd></div><div><dt>Labels: <code>case 1</code> and <code>case 2</code></dt><dd>These literal values identify the menu actions. They are choices, not loop counters.</dd></div><div><dt>Fallback: <code>${fallback}</code></dt><dd>Handles an unmatched value. Without it, an unmatched choice skips the bodies and continues afterward.</dd></div><div><dt>${python ? 'End of the matching block' : 'Case exit: break'}</dt><dd>${python ? 'Python executes the matching case block without falling into the next case. No break is needed.' : 'The sample uses break to leave the switch. Afterward, the program continues with the statement following it.'}</dd></div></dl></section><section aria-labelledby="switch-sim-title"><h3 id="switch-sim-title">Follow the selected path</h3><p class="tag">Educational simulation</p><p>This model steps through the displayed menu example; it does not execute your code. Try choice 1, choice 2, and an unmatched value. Toggle the fallback and compare the output.</p><div id="switch-simulator"></div></section><section><h3>Common mistakes and useful patterns</h3><ul><li>Confusing a menu selection with repetition. A selection chooses a path; it does not run a loop.</li><li>Leaving out a fallback when an unexpected choice needs a message.</li><li>${python ? 'Treating match/case as a C switch. Python patterns have their own rules, and there is no implicit fall-through.' : c.codeLanguage === 'csharp' ? 'Removing the case exit from a nonempty C# section. This is a compilation error, not automatic fall-through.' : 'Forgetting break when only one case body should run. Later bodies can execute without another match.'}</li><li>${['c', 'cpp'].includes(c.codeLanguage) ? 'Using duplicate case values or a runtime variable as a case label. These languages require unique constant case values.' : 'Copying syntax from another language. Read the selected language’s matching rules.'}</li></ul><p>Several choices can share an action: ${python ? '<code>case 1 | 2:</code> uses an OR pattern for these literals.' : 'consecutive labels such as <code>case 1:</code> followed by <code>case 2:</code> can share one body.'} Keep intentional sharing clear. Menus, command dispatch, and fixed status codes are useful applications.</p><p class="small"><a href="${esc(D.sources[c.codeLanguage])}" target="_blank" rel="noopener">Selected language’s selection-statement documentation</a></p></section><section id="switch-quiz" aria-label="Switch lesson quiz"></section><section class="for-challenge"><h3>Try it in the online editor</h3><p>Add a third action: choice 3 should print Settings. Keep the fallback for other values. Test choices 1, 2, 3, and 0. Run the example in the existing editor, edit it there, and compare the output yourself; there is no automatic code grading.</p><details><summary>Hint</summary><p>Add a literal case 3 with a print statement. ${python ? 'Keep case _ last.' : 'Finish the new section with break.'} The final After selection message should still print.</p></details><details><summary>Expected output for choice 3</summary><pre dir="ltr">Settings
After selection</pre></details></section><section aria-label="Switch lesson progress"><h3>Your progress</h3><p>Quiz results and your completion marker stay in this browser, separately for each programming language. No registration or personal information is needed.</p><div id="switch-progress"></div></section></div>`;
  }
  function draw() {
    const root = document.getElementById('switch-simulator'); if (!root) return;
    const m = model(), state = m.states[position], python = context.codeLanguage === 'python';
    const explanations = {
      ready: 'Ready. No instruction has executed yet.', initialize: `Set choice to ${choice}.`,
      dispatch: `Select ${m.selected}. ${m.selected === 'No match' ? 'Skip the case bodies.' : 'Execution begins in that branch.'}`,
      body: `Execute the print in ${state.active}.`, fallthrough: 'Continue into case 2 without testing its value again.',
      break: 'break leaves the switch and skips the remaining bodies.', after: 'Continue after the selection and print After selection.', terminate: 'This example is complete.'
    };
    root.innerHTML = `<div class="controls"><label for="switch-choice">Choice</label><select id="switch-choice">${[0, 1, 2, 3].map(n => `<option value="${n}" ${n === choice ? 'selected' : ''}>${n}${n === 1 ? ' · Start' : n === 2 ? ' · Help' : ' · No numbered case'}</option>`).join('')}</select><label><input id="switch-default" type="checkbox" ${includeDefault ? 'checked' : ''}> Include ${python ? 'case _' : 'default'}</label>${S.canFallThrough(context.codeLanguage) ? `<label><input id="switch-break" type="checkbox" ${breakAfterFirst ? 'checked' : ''}> break after Start</label>` : ''}</div><div class="switch-path" role="group" aria-label="Case paths">${['case 1', 'case 2', ...(includeDefault ? [python ? 'case _' : 'default'] : [])].map(label => `<span class="${position>=2&&m.selected === label ? 'selected' : ''} ${state.active === label ? 'executing' : ''}">${esc(label)}</span>`).join('')}</div><div class="for-sim-grid"><div><p id="switch-step-status" role="status"><strong>Step ${position} / ${m.states.length - 1} · ${esc(state.phase)}</strong><br>${esc(explanations[state.phase])}</p><dl class="for-metrics"><div><dt>Choice</dt><dd>${choice}</dd></div><div><dt>Selected branch</dt><dd>${position < 2 ? 'Not selected yet' : esc(m.selected)}</dd></div><div><dt>Active branch</dt><dd>${esc(state.active || '—')}</dd></div></dl><div class="controls"><button type="button" data-switch-step="previous" ${position === 0 ? 'disabled' : ''}>Previous</button><button type="button" data-switch-step="next" ${position === m.states.length - 1 ? 'disabled' : ''}>Next</button><button type="button" data-switch-step="reset">Reset</button></div><h4>Program output so far</h4><pre class="output" dir="ltr">${esc(state.output || '(no output)')}</pre></div><div><h4>${esc(window.COURSE_DATA.programs[context.codeLanguage].label)} source · highlighted instruction</h4><pre class="for-source" tabindex="0" dir="ltr"><code>${m.code.trimEnd().split('\n').map((line, i) => `<span class="code-line ${state.line === i ? 'executing' : ''}" ${state.line === i ? 'aria-current="step"' : ''}>${esc(line) || ' '}</span>`).join('')}</code></pre><div class="controls"><button type="button" data-switch-editor>Run real code</button><button type="button" data-switch-copy>Copy code</button><button type="button" data-switch-download>Download code</button></div><p id="switch-code-status" role="status"></p></div></div>`;
  }
  function drawProgress() {
    const root = document.getElementById('switch-progress'); if (!root) return;
    const p = store.get(id());
    root.innerHTML = `<p role="status">${p.completed ? 'Lesson marked complete.' : 'Lesson not yet marked complete.'} ${p.latest ? `Latest quiz: ${p.latest.score}/${p.latest.total}. Best: ${p.best.score}/${p.best.total}. Attempts: ${p.attempts}.` : 'No completed quiz yet.'} ${store.isPersistent() ? '' : 'Browser storage is unavailable. Progress is kept for this page session only.'}</p><button type="button" data-switch-complete>${p.completed ? 'Mark incomplete' : 'Mark lesson complete'}</button>`;
  }
  function mount() {
    const root = document.querySelector('.switch-lesson'); if (!root) return;
    draw(); drawProgress();
    mountQuiz(root.querySelector('#switch-quiz'), { quiz: quiz(), id: id(), onComplete: result => { store.recordQuiz(id(), result); drawProgress(); } });
    root.addEventListener('change', e => {
      const input = e.target;
      if (input.id === 'switch-choice') choice = Number(input.value);
      else if (input.id === 'switch-default') includeDefault = input.checked;
      else if (input.id === 'switch-break') breakAfterFirst = input.checked;
      else return;
      position = 0; draw(); root.querySelector('#' + input.id)?.focus();
    });
    root.addEventListener('click', async e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.switchStep) {
        const action = b.dataset.switchStep;
        position = action === 'reset' ? 0 : Math.max(0, Math.min(model().states.length - 1, position + (action === 'next' ? 1 : -1)));
        draw(); const control = root.querySelector(`[data-switch-step="${action}"]`);
        if (control.disabled) { const status = root.querySelector('#switch-step-status'); status.tabIndex = -1; status.focus(); } else control.focus();
      }
      const code = model().code, p = window.COURSE_DATA.programs[context.codeLanguage];
      if (b.hasAttribute('data-switch-editor')) window.CodeRunner.open({ language: context.language, codeLanguage: context.codeLanguage, code, filename: p.filename || 'switch.' + p.ext, label: p.label + ' · Switch' });
      if (b.hasAttribute('data-switch-copy')) {
        try { await navigator.clipboard.writeText(code); root.querySelector('#switch-code-status').textContent = window.COURSE_DATA.translations[context.language].ui.copied; }
        catch { root.querySelector('#switch-code-status').textContent = window.COURSE_DATA.translations[context.language].ui.copyFailed; }
      }
      if (b.hasAttribute('data-switch-download')) {
        const url = URL.createObjectURL(new Blob([code], { type: 'text/plain;charset=utf-8' }));
        const a = document.createElement('a'); a.href = url; a.download = p.filename || 'switch.' + p.ext; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      if (b.hasAttribute('data-switch-complete')) { store.complete(id(), !store.get(id()).completed); drawProgress(); root.querySelector('[data-switch-complete]').focus(); }
    });
  }
  window.SwitchLesson = { render, mount };
})();
