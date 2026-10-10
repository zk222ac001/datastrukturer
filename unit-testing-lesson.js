'use strict';
(() => {
  const D = window.UNIT_TESTING_DATA, { esc, mountQuiz } = window.CodeVizLearningUI;
  const quiz = new window.CodeVizLearning.Quiz(D.questions);
  const store = window.CodeVizLearning.createProgressStore();
  const lessonId = 'unit-testing-en-v1';
  const aaaSteps = [
    { id: 'arrange', title: 'Arrange: prepare the input', description: 'Choose a known value and set up only the dependencies this test needs.', value: 'value = 4', result: 'Ready' },
    { id: 'act', title: 'Act: call the behavior', description: 'Run the one function or method this unit test is checking.', value: 'result = isEven(4)', result: 'true' },
    { id: 'assert', title: 'Assert: check the expectation', description: 'Compare the actual result with the expected result. A mismatch should fail the test.', value: 'true === true', result: 'PASS' }
  ];
  let context;

  function example() {
    const ex = D.examples[context.codeLanguage];
    const p = window.COURSE_DATA.programs[context.codeLanguage];
    return `<section id="unit-testing-example" aria-labelledby="unit-testing-example-title"><h2 id="unit-testing-example-title">Runnable test example · ${esc(p.label)}</h2><p>${esc(ex.note)}</p><div class="controls"><button type="button" data-unit-testing-run>Run tests</button><button type="button" data-unit-testing-copy>Copy code</button><button type="button" data-unit-testing-download>Download code</button></div><pre tabindex="0" dir="ltr"><code>${esc(ex.code)}</code></pre><h3>Expected output</h3><pre class="output" dir="ltr">${esc(ex.output.trimEnd())}</pre></section>`;
  }

  function progress() {
    const p = store.get(lessonId);
    return `<p role="status">${p.completed ? 'Lesson marked complete.' : 'Lesson not yet marked complete.'} ${p.latest ? `Latest quiz: ${p.latest.score}/${p.latest.total}. Best: ${p.best.score}/${p.best.total}. Attempts: ${p.attempts}.` : 'No completed quiz yet.'} ${store.isPersistent() ? '' : 'Browser storage is unavailable. Progress is kept for this page session only.'}</p><button type="button" data-unit-testing-complete>${p.completed ? 'Mark incomplete' : 'Mark lesson complete'}</button>`;
  }

  function render(c) {
    context = c;
    return `${c.language !== 'en' ? `<p class="notice">${esc(D.locales[c.language][2])}</p>` : ''}<div class="unit-testing-lesson" lang="en" dir="ltr"><p class="eyebrow">Interactive lesson · unit testing</p><nav class="module-outline" aria-label="Unit testing lesson sections"><a class="button" href="#unit-testing-1">13.1 What is a unit test?</a><a class="button" href="#unit-testing-2">13.2 Arrange, Act, Assert</a><a class="button" href="#unit-testing-3">13.3 Assertions and test cases</a><a class="button" href="#unit-testing-4">13.4 Isolation and test doubles</a><a class="button" href="#unit-testing-5">13.5 Good test practices</a><a class="button" href="#unit-testing-quiz">Quiz</a><a class="button" href="#unit-testing-practice">Practice</a></nav>${example()}
      <section id="unit-testing-1"><h2>13.1 What is a unit test?</h2><p>A <strong>unit test</strong> checks a small, focused part of a program—often one function or method—against an expected result. A suite runs many such checks so changes can be tested quickly and repeatedly. Unit tests are usually automated and run as part of development and continuous integration.</p><p>A unit test is not a proof that a program has no bugs. It complements integration tests, which check components working together, and end-to-end tests, which exercise a complete user-visible flow. The runnable example checks an <code>isEven</code> function with one even and one odd number.</p></section>
      <section id="unit-testing-2"><h2>13.2 Arrange, Act, Assert</h2><p>A clear test often follows <strong>Arrange–Act–Assert</strong> (AAA): prepare inputs and dependencies, call the behavior, then check the result. Keep each test focused on one behavior and give it a name that describes the expected behavior.</p><div class="aaa-visual" data-aaa-visual><div class="aaa-step-controls" role="group" aria-label="Explore the three test steps">${aaaSteps.map((step, index) => `<button type="button" data-aaa-step="${step.id}" aria-pressed="${index === 0}">${index + 1}. ${step.id}</button>`).join('')}</div><div class="aaa-flow" aria-label="Test flow from input to result"><div data-aaa-node="arrange" data-active><span>Arrange</span><code>value = 4</code></div><span class="aaa-arrow" aria-hidden="true">→</span><div data-aaa-node="act"><span>Act</span><code>isEven(value)</code></div><span class="aaa-arrow" aria-hidden="true">→</span><div data-aaa-node="assert"><span>Assert</span><code>true === true</code></div></div><div class="aaa-explanation" aria-live="polite" aria-atomic="true"><span data-aaa-count>Step 1 of 3</span><h3 data-aaa-title>${aaaSteps[0].title}</h3><p data-aaa-description>${aaaSteps[0].description}</p><div class="aaa-result"><span>Example result</span><strong data-aaa-result>${aaaSteps[0].result}</strong></div></div></div><p>The flow above is language-neutral. The selected language uses its own syntax and testing tools. The runnable examples avoid extra packages so you can focus on what the checks mean.</p></section>
      <section id="unit-testing-3"><h2>13.3 Assertions and useful test cases</h2><p>An <strong>assertion</strong> states what should be true. If it fails, the test runner should clearly mark the test as failed and show a useful difference between expected and actual values. Avoid checks that can pass without verifying the behavior you care about.</p><p>Test representative normal inputs, boundaries, and invalid inputs where relevant. For a numeric function, that might mean zero, a positive number, a negative number, or the largest supported value. Tests should be deterministic: control time, randomness, and external responses rather than expecting a particular network or clock result.</p><p>Coverage reports indicate which code ran, not whether tests made meaningful assertions or considered the right cases. High coverage alone is not a guarantee of correctness.</p></section>
      <section id="unit-testing-4"><h2>13.4 Isolation and test doubles</h2><p>A focused unit test controls its inputs and avoids depending on a real network, production database, current time, or machine-specific files. Uncontrolled dependencies make tests slow, flaky, and harder to reproduce.</p><p>A <strong>test double</strong> is a substitute used during a test. A stub returns a prepared answer; a fake provides a simplified working implementation; a mock can verify expected interactions. Use the simplest substitute that makes the behavior testable, and keep important integration behavior covered by integration tests too.</p></section>
      <section id="unit-testing-5"><h2>13.5 Writing maintainable tests</h2><ul><li>Give tests descriptive names and check observable behavior rather than private implementation details.</li><li>Make each test repeatable and independent of execution order.</li><li>Keep setup small; shared fixtures should not hide what a test needs.</li><li>Check boundary and failure cases as well as the happy path.</li><li>When a bug is fixed, add a test that would have failed before the fix.</li></ul><p>Common tools include GoogleTest or Catch2 for C++, pytest or unittest for Python, JUnit for Java, Node’s built-in <code>node:test</code> for JavaScript, and xUnit, NUnit, or MSTest for C#. C has several third-party testing frameworks. The example notes point out language-specific assertion caveats.</p></section>
      <section id="unit-testing-quiz" aria-label="Unit testing quiz"></section><section id="unit-testing-practice"><h2>Practice</h2><p>Extend the example with tests for zero and a negative number. Add a test for a behavior with a boundary condition, then deliberately change one expected value and confirm the test run fails instead of reporting a pass.</p><details><summary>Hint</summary><p>Make one clearly named test per behavior. Keep the tested function independent from input/output, and put printing or framework reporting in the test runner rather than inside the function being tested.</p></details></section>
      <section aria-label="Unit testing progress"><h2>Your progress</h2><p>Quiz results and your completion marker stay in this browser. No registration or personal information is needed.</p><div id="unit-testing-progress">${progress()}</div></section><p class="small">Further reading: <a href="https://docs.python.org/3/library/unittest.html" target="_blank" rel="noopener">Python unittest</a>, <a href="https://nodejs.org/api/test.html" target="_blank" rel="noopener">Node.js test runner</a>, <a href="https://junit.org/junit5/docs/current/user-guide/" target="_blank" rel="noopener">JUnit 5 User Guide</a>.</p><p id="unit-testing-code-status" role="status"></p></div>`;
  }

  function mount() {
    const root = document.querySelector('.unit-testing-lesson');
    if (!root) return;
    mountQuiz(root.querySelector('#unit-testing-quiz'), {
      quiz,
      id: lessonId,
      onComplete: result => {
        store.recordQuiz(lessonId, result);
        root.querySelector('#unit-testing-progress').innerHTML = progress();
      }
    });
    root.addEventListener('click', async event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.hasAttribute('data-aaa-step')) {
        const index = aaaSteps.findIndex(step => step.id === button.dataset.aaaStep);
        if (index === -1) return;
        const step = aaaSteps[index];
        root.querySelectorAll('[data-aaa-step]').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
        root.querySelectorAll('[data-aaa-node]').forEach(node => node.toggleAttribute('data-active', node.dataset.aaaNode === step.id));
        root.querySelector('[data-aaa-count]').textContent = `Step ${index + 1} of ${aaaSteps.length}`;
        root.querySelector('[data-aaa-title]').textContent = step.title;
        root.querySelector('[data-aaa-description]').textContent = step.description;
        root.querySelector('[data-aaa-result]').textContent = step.result;
        return;
      }
      if (button.hasAttribute('data-unit-testing-complete')) {
        store.complete(lessonId, !store.get(lessonId).completed);
        root.querySelector('#unit-testing-progress').innerHTML = progress();
        root.querySelector('[data-unit-testing-complete]').focus();
        return;
      }
      if (!button.matches('[data-unit-testing-run], [data-unit-testing-copy], [data-unit-testing-download]')) return;
      const ex = D.examples[context.codeLanguage], p = window.COURSE_DATA.programs[context.codeLanguage];
      const code = ex.code, filename = p.filename || `unit-testing-example.${p.ext}`;
      if (button.hasAttribute('data-unit-testing-run')) {
        window.CodeRunner.open({ language: context.language, codeLanguage: context.codeLanguage, code, filename, label: p.label + ' · Unit Testing' });
      } else if (button.hasAttribute('data-unit-testing-copy')) {
        try {
          await navigator.clipboard.writeText(code);
          root.querySelector('#unit-testing-code-status').textContent = window.COURSE_DATA.translations[context.language].ui.copied;
        } catch {
          root.querySelector('#unit-testing-code-status').textContent = window.COURSE_DATA.translations[context.language].ui.copyFailed;
        }
      } else {
        const url = URL.createObjectURL(new Blob([code], { type: 'text/plain;charset=utf-8' }));
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    });
  }

  window.UnitTestingLesson = { render, mount };
})();
