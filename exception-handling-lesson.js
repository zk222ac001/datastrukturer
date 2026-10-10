'use strict';
(() => {
  const D = window.EXCEPTION_HANDLING_DATA, { esc, mountQuiz } = window.CodeVizLearningUI;
  const quiz = new window.CodeVizLearning.Quiz(D.questions);
  const store = window.CodeVizLearning.createProgressStore();
  const lessonId = 'exception-handling-en-v1';
  let context;

  function example() {
    const ex = D.examples[context.codeLanguage];
    const p = window.COURSE_DATA.programs[context.codeLanguage];
    return `<section id="exception-handling-example" aria-labelledby="exception-handling-example-title"><h2 id="exception-handling-example-title">Runnable example · ${esc(p.label)}</h2><p>${esc(ex.note)}</p><div class="controls"><button type="button" data-exception-handling-run>Run example</button><button type="button" data-exception-handling-copy>Copy code</button><button type="button" data-exception-handling-download>Download code</button></div><pre tabindex="0" dir="ltr"><code>${esc(ex.code)}</code></pre><h3>Expected output</h3><pre class="output" dir="ltr">${esc(ex.output.trimEnd())}</pre></section>`;
  }

  function progress() {
    const p = store.get(lessonId);
    return `<p role="status">${p.completed ? 'Lesson marked complete.' : 'Lesson not yet marked complete.'} ${p.latest ? `Latest quiz: ${p.latest.score}/${p.latest.total}. Best: ${p.best.score}/${p.best.total}. Attempts: ${p.attempts}.` : 'No completed quiz yet.'} ${store.isPersistent() ? '' : 'Browser storage is unavailable. Progress is kept for this page session only.'}</p><button type="button" data-exception-handling-complete>${p.completed ? 'Mark incomplete' : 'Mark lesson complete'}</button>`;
  }

  function render(c) {
    context = c;
    return `${c.language !== 'en' ? `<p class="notice">${esc(D.locales[c.language][2])}</p>` : ''}<div class="exception-handling-lesson" lang="en" dir="ltr"><p class="eyebrow">Interactive lesson · exception handling</p><nav class="module-outline" aria-label="Exception handling lesson sections"><a class="button" href="#exception-handling-1">12.1 Errors and exceptions</a><a class="button" href="#exception-handling-2">12.2 Throwing and propagation</a><a class="button" href="#exception-handling-3">12.3 Catching errors</a><a class="button" href="#exception-handling-4">12.4 Cleanup and recovery</a><a class="button" href="#exception-handling-quiz">Quiz</a><a class="button" href="#exception-handling-practice">Practice</a></nav>${example()}
      <section id="exception-handling-1"><h2>12.1 What are errors and exceptions?</h2><p>An <strong>error</strong> is a problem that prevents an operation from completing as intended. An <strong>exception</strong> is a language/runtime mechanism for reporting an exceptional condition and transferring control to code that can respond to it. Examples include invalid input, a missing file, or a network operation that fails.</p><p>Not every problem should be an exception. Use ordinary conditions for expected alternatives such as “no search result.” Validate input at boundaries, and use the language’s documented error mechanism for failures. Error-handling features differ: C uses explicit status conventions rather than built-in try/catch exceptions.</p></section>
      <section id="exception-handling-2"><h2>12.2 Throwing exceptions and propagation</h2><p>A function can <strong>throw</strong> (or, in Python, <strong>raise</strong>) an exception when it cannot complete its contract. The exception propagates through callers until a compatible handler is found. If no handler is found, the operation typically terminates with an error.</p><pre dir="ltr"><code>function validate(value):
    if value is invalid:
        raise an error
    return value

try:
    use(validate(input))
catch a matching error:
    recover or report it</code></pre><p>Keep error messages useful without exposing secrets. Add context when rethrowing, and preserve the original cause where the language supports it. Do not use exceptions as a substitute for routine branching.</p></section>
      <section id="exception-handling-3"><h2>12.3 Catching and handling errors</h2><p>A <code>try</code> block marks operations that can fail; one or more <code>catch</code> or <code>except</code> handlers respond to selected error types. Catch the narrowest type you can actually handle. A broad catch can hide bugs such as null access or incorrect assumptions.</p><p>Handling an error means choosing a meaningful response: correct input, retry a transient operation within a limit, show a clear message, or pass the failure to a layer with enough information to decide. Logging and user-facing messages should be appropriate to their audiences.</p><p>Some languages distinguish checked and unchecked exceptions. Java requires checked exceptions to be caught or declared; unchecked exceptions usually signal programming errors or conditions callers are not forced to handle. Other languages use their own type hierarchies and conventions.</p></section>
      <section id="exception-handling-4"><h2>12.4 Cleanup, finally, and recovery</h2><p>A <code>finally</code> block in Python, Java, JavaScript, and C# runs as control leaves its <code>try</code> statement, whether normally or through an exception. Use it for cleanup that is not already handled by a dedicated resource construct. C++ uses stack unwinding and RAII; C uses explicit cleanup paths and resource-release calls. C has no built-in <code>try</code>/<code>catch</code>.</p><p>Prefer resource-management features where available: C++ RAII, Python <code>with</code>, Java try-with-resources, and C# <code>using</code>. These close resources more reliably than manually duplicating cleanup. In JavaScript, remember that asynchronous Promise rejections require <code>await</code> within a <code>try</code> block or an explicit rejection handler.</p><p>When recovery is impossible, fail clearly and preserve the cause. Avoid empty handlers, silent success-shaped fallbacks, and retry loops without limits.</p></section>
      <section id="exception-handling-quiz" aria-label="Exception handling quiz"></section><section id="exception-handling-practice"><h2>Practice</h2><p>Change the runnable example so it checks two values: one valid and one invalid. Handle the invalid value with a specific error type, and ensure the cleanup message appears after either outcome. Then try removing the handler and observe how the failure propagates.</p><details><summary>Hint</summary><p>Put the validation in a function that reports a failure when the value is not positive. Use a try/catch or try/except in languages that support exceptions. In C, check and respond to the function’s status result explicitly.</p></details></section>
      <section aria-label="Exception handling progress"><h2>Your progress</h2><p>Quiz results and your completion marker stay in this browser. No registration or personal information is needed.</p><div id="exception-handling-progress">${progress()}</div></section><p class="small">Further reading: <a href="https://docs.python.org/3/tutorial/errors.html" target="_blank" rel="noopener">Python: Errors and Exceptions</a>, <a href="https://docs.oracle.com/javase/tutorial/essential/exceptions/" target="_blank" rel="noopener">Oracle Java Tutorials: Exceptions</a>, <a href="https://en.cppreference.com/w/cpp/language/exceptions" target="_blank" rel="noopener">C++ exceptions</a>.</p><p id="exception-handling-code-status" role="status"></p></div>`;
  }

  function mount() {
    const root = document.querySelector('.exception-handling-lesson');
    if (!root) return;
    mountQuiz(root.querySelector('#exception-handling-quiz'), {
      quiz,
      id: lessonId,
      onComplete: result => {
        store.recordQuiz(lessonId, result);
        root.querySelector('#exception-handling-progress').innerHTML = progress();
      }
    });
    root.addEventListener('click', async event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.hasAttribute('data-exception-handling-complete')) {
        store.complete(lessonId, !store.get(lessonId).completed);
        root.querySelector('#exception-handling-progress').innerHTML = progress();
        root.querySelector('[data-exception-handling-complete]').focus();
        return;
      }
      if (!button.matches('[data-exception-handling-run], [data-exception-handling-copy], [data-exception-handling-download]')) return;
      const ex = D.examples[context.codeLanguage], p = window.COURSE_DATA.programs[context.codeLanguage];
      const code = ex.code, filename = p.filename || `exception-handling-example.${p.ext}`;
      if (button.hasAttribute('data-exception-handling-run')) {
        window.CodeRunner.open({ language: context.language, codeLanguage: context.codeLanguage, code, filename, label: p.label + ' · Exception Handling' });
      } else if (button.hasAttribute('data-exception-handling-copy')) {
        try {
          await navigator.clipboard.writeText(code);
          root.querySelector('#exception-handling-code-status').textContent = window.COURSE_DATA.translations[context.language].ui.copied;
        } catch {
          root.querySelector('#exception-handling-code-status').textContent = window.COURSE_DATA.translations[context.language].ui.copyFailed;
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

  window.ExceptionHandlingLesson = { render, mount };
})();
