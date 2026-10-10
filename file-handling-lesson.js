'use strict';
(() => {
  const D = window.FILE_HANDLING_DATA, { esc, mountQuiz } = window.CodeVizLearningUI;
  const quiz = new window.CodeVizLearning.Quiz(D.questions);
  const store = window.CodeVizLearning.createProgressStore();
  const lessonId = 'file-handling-en-v1';
  let context;

  function example() {
    const ex = D.examples[context.codeLanguage];
    const p = window.COURSE_DATA.programs[context.codeLanguage];
    return `<section id="file-handling-example" aria-labelledby="file-handling-example-title"><h2 id="file-handling-example-title">Runnable example · ${esc(p.label)}</h2><p>${esc(ex.note)}</p><div class="controls"><button type="button" data-file-handling-run>Run example</button><button type="button" data-file-handling-copy>Copy code</button><button type="button" data-file-handling-download>Download code</button></div><pre tabindex="0" dir="ltr"><code>${esc(ex.code)}</code></pre><h3>Expected output</h3><pre class="output" dir="ltr">${esc(ex.output.trimEnd())}</pre></section>`;
  }

  function progress() {
    const p = store.get(lessonId);
    return `<p role="status">${p.completed ? 'Lesson marked complete.' : 'Lesson not yet marked complete.'} ${p.latest ? `Latest quiz: ${p.latest.score}/${p.latest.total}. Best: ${p.best.score}/${p.best.total}. Attempts: ${p.attempts}.` : 'No completed quiz yet.'} ${store.isPersistent() ? '' : 'Browser storage is unavailable. Progress is kept for this page session only.'}</p><button type="button" data-file-handling-complete>${p.completed ? 'Mark incomplete' : 'Mark lesson complete'}</button>`;
  }

  function render(c) {
    context = c;
    return `${c.language !== 'en' ? `<p class="notice">${esc(D.locales[c.language][2])}</p>` : ''}<div class="file-handling-lesson" lang="en" dir="ltr"><p class="eyebrow">Interactive lesson · file handling</p><nav class="module-outline" aria-label="File handling lesson sections"><a class="button" href="#file-handling-1">11.1 File handling</a><a class="button" href="#file-handling-2">11.2 Write text to a file</a><a class="button" href="#file-handling-3">11.3 Read data from a file</a><a class="button" href="#file-handling-4">11.4 OOP and file handling</a><a class="button" href="#file-handling-quiz">Quiz</a><a class="button" href="#file-handling-practice">Practice</a></nav>${example()}
      <section id="file-handling-1"><h2>11.1 What is file handling?</h2><p><strong>File handling</strong> lets a program keep information after it finishes. A file has a path and a format; a text file stores readable characters. Programs can create, open, read, write, append to, and close files using the operating system through their language’s file APIs.</p><p>The example uses the relative path <code>codeviz-note.txt</code>, resolved from the program’s <strong>working directory</strong>. That directory is not necessarily the directory containing the source file. The program writes one line, closes the file, opens it for reading, then prints what it read.</p><div class="table-wrap"><table><caption>Common text-file modes</caption><thead><tr><th scope="col">Intent</th><th scope="col">Typical mode</th><th scope="col">Effect</th></tr></thead><tbody><tr><th scope="row">Read</th><td><code>r</code></td><td>Read an existing file; opening usually fails if it does not exist.</td></tr><tr><th scope="row">Write</th><td><code>w</code></td><td>Create or replace a file; existing contents are usually erased.</td></tr><tr><th scope="row">Append</th><td><code>a</code></td><td>Create if needed and add new text at the end.</td></tr></tbody></table></div><p>Mode names and APIs vary by language. Always check whether opening and each required operation succeeded. Never assume an absolute path, permissions, directory, or file contents without checking.</p></section>
      <section id="file-handling-2"><h2>11.2 How to write text data into a file</h2><p>Choose a path, open the file in a write or append mode, write text with the intended character encoding, and close it. The runnable examples replace the contents of <code>codeviz-note.txt</code> in the working directory. Run them only where you have permission to create or replace that file.</p><ol><li>Open the file and check for an error.</li><li>Write the text and any required line ending.</li><li>Close the file or use a resource-management block so buffered text is flushed and the handle is released.</li></ol><p>Write mode can overwrite earlier data; use append mode when you need to keep existing contents. For important data, handle partial failures rather than reporting success just because opening worked.</p></section>
      <section id="file-handling-3"><h2>11.3 How to read data from a file</h2><p>Open the file in read mode, read its contents or lines, check for end-of-file and errors, then close it. This lesson reads the line written by the example. A real file can be empty, missing, too large, or contain text in an unexpected encoding, so programs should validate what they read.</p><pre dir="ltr"><code>open file for reading
if opening failed:
    report the error
else:
    read text
    close file</code></pre><p>Do not treat user-provided file contents as automatically safe or valid. For larger files, process them in chunks or one line at a time instead of loading the entire file into memory.</p></section>
      <section id="file-handling-4"><h2>11.4 How OOP is used in file handling</h2><p>Object-oriented design can package a file path and related operations in a class, such as the <code>NoteFile</code> in the runnable C++, Python, Java, JavaScript, and C# examples. The path is kept private; public <code>writeText</code> and <code>readText</code> methods provide a small interface. This is <strong>encapsulation</strong>: callers ask for an operation without managing every implementation detail.</p><p>File and stream objects represent open resources. Resource-management features—C++ RAII, Python’s <code>with</code>, Java try-with-resources, and C# <code>using</code>—ensure streams are closed even when an operation fails. JavaScript’s example uses synchronous file functions, so no stream handle needs closing. In C, a <code>FILE*</code> and functions such as <code>fopen</code>, <code>fprintf</code>, and <code>fclose</code> are used directly; C does not have built-in classes or methods.</p><p>A class can also separate storage from the rest of an application, validate data before saving, or implement a shared interface for different storage types. Keep error handling visible, and avoid making a class when a few simple functions would be clearer.</p></section>
      <section id="file-handling-safety"><h2>Reliable file operations</h2><ul><li>Handle missing files, permission errors, and full disks; do not silently discard failures.</li><li>Close resources reliably, including after exceptions or early returns.</li><li>Use explicit text encoding when the language supports it, and agree on line-ending and data-format rules.</li><li>Use a safe, expected directory and validate paths that come from users.</li><li>Back up or use a temporary file when replacing important data.</li></ul></section>
      <section id="file-handling-quiz" aria-label="File handling quiz"></section><section id="file-handling-practice"><h2>Practice</h2><p>Change the example to save two lines. Read them both back and display them. Then switch from replace mode to append mode and run the program twice: observe which contents remain.</p><details><summary>Hint</summary><p>Write each line followed by a newline. Read lines until end-of-file, and make sure the file is closed before opening it for reading. To test append behavior, write without deleting the existing file first.</p></details></section>
      <section aria-label="File handling progress"><h2>Your progress</h2><p>Quiz results and your completion marker stay in this browser. No registration or personal information is needed.</p><div id="file-handling-progress">${progress()}</div></section><p class="small">Further reading: <a href="https://docs.oracle.com/javase/tutorial/essential/io/" target="_blank" rel="noopener">Oracle Java Tutorials: Basic I/O</a>, <a href="https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files" target="_blank" rel="noopener">Python: Reading and Writing Files</a>, <a href="https://en.cppreference.com/w/cpp/io/basic_fstream" target="_blank" rel="noopener">C++ file streams</a>.</p><p id="file-handling-code-status" role="status"></p></div>`;
  }

  function mount() {
    const root = document.querySelector('.file-handling-lesson');
    if (!root) return;
    mountQuiz(root.querySelector('#file-handling-quiz'), {
      quiz,
      id: lessonId,
      onComplete: result => {
        store.recordQuiz(lessonId, result);
        root.querySelector('#file-handling-progress').innerHTML = progress();
      }
    });
    root.addEventListener('click', async event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.hasAttribute('data-file-handling-complete')) {
        store.complete(lessonId, !store.get(lessonId).completed);
        root.querySelector('#file-handling-progress').innerHTML = progress();
        root.querySelector('[data-file-handling-complete]').focus();
        return;
      }
      if (!button.matches('[data-file-handling-run], [data-file-handling-copy], [data-file-handling-download]')) return;
      const ex = D.examples[context.codeLanguage], p = window.COURSE_DATA.programs[context.codeLanguage];
      const code = ex.code, filename = p.filename || `file-handling-example.${p.ext}`;
      if (button.hasAttribute('data-file-handling-run')) {
        window.CodeRunner.open({ language: context.language, codeLanguage: context.codeLanguage, code, filename, label: p.label + ' · File Handling' });
      } else if (button.hasAttribute('data-file-handling-copy')) {
        try {
          await navigator.clipboard.writeText(code);
          root.querySelector('#file-handling-code-status').textContent = window.COURSE_DATA.translations[context.language].ui.copied;
        } catch {
          root.querySelector('#file-handling-code-status').textContent = window.COURSE_DATA.translations[context.language].ui.copyFailed;
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

  window.FileHandlingLesson = { render, mount };
})();
