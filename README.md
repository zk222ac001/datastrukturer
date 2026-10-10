# CodeViz — Learn programming with Visualization

## Interactive for-loop lesson (first milestone)

Open `index.html?lang=en&code=c#counter` to use the new lesson. It includes an educational step simulation, annotated tutorial and execution table, five questions with immediate explanations, and two C challenges that open in the existing OneCompiler editor. Previous restores the earlier simulated state; Reset returns to the beginning. Apply and reset accepts bounded integer start/end/step values, counts down for negative steps, and supports zero iterations. This is a teaching model of the displayed loop, not a general C interpreter.

The enhanced lesson is initially C and English. Other programming languages retain their existing translated lessons, examples and simulations, with a notice and an explicit link to the C lesson. The ten interface languages and RTL shell remain available. English fallback content is marked `lang="en"` and displayed left-to-right; code is always left-to-right. Existing `#counter`, module URLs, language parameters and GitHub Pages deployment are preserved.

Completion is a student-controlled marker, independent of the quiz score. Only finished quiz attempts save their latest and best scores and attempt count. Progress uses `codeviz-progress-v1` in browser local storage, with no account or personal data. Blocked storage or write failures fall back to page-session memory; clearing working storage resets saved progress. Retrying a quiz clears the current answers but preserves completed attempt history. Challenges are self-checked against expected output; there is no automatic grading. OneCompiler receives code only when the editor is opened, as before.

Changed and added files:

- `learning-core.js`: reusable pure loop trace, quiz model and versioned progress store; also loadable by Node tests.
- `learning-ui.js`: reusable, scoped multiple-choice quiz renderer with keyboard focus and feedback.
- `for-lesson-data.js`: five C questions, exercise starters, hints and solutions.
- `for-lesson.js`: English tutorial, simulation controls, language fallback and existing editor integration.
- `course.js`, `course.css`, `index.html`: narrow lesson integration, section routes, responsive styling and script loading.
- `package.json`, `package-lock.json`, `.gitignore`, `playwright.config.cjs`, `tests/`: development-only test tooling. There are no runtime dependencies or build requirements.

Local testing (Node.js 20+ for the browser test tooling):

```sh
npm ci
npm test
npx playwright install chromium
npm run test:browser
npm run serve
```

The last command serves the site at `http://127.0.0.1:4173`; open `/index.html?lang=en&code=c#counter`. Browser tests start and stop their own local server. They cover forward/backward/reset simulation, boundaries, quiz retry/scoring, progress/reload/clearing, blocked storage, language fallbacks, RTL/mobile layout, 240 existing module views and 720 formatting demonstrations, legacy reference links, original simulations, downloads, and the lazy-loaded editor. Editor browser tests intercept the external provider and verify integration; they do not claim to test OneCompiler uptime or remotely execute C. The separate C source test compiles and executes both exercise solutions and representative simulated loops if GCC is installed (otherwise it reports a skip).

Manual checks: navigate with Tab, select quiz answers with arrow keys, explore positive/negative/zero-iteration loops, switch both selectors, and run a challenge in the actual OneCompiler editor. No push or deployment is required for local testing; GitHub Pages continues to serve the static files from the existing deployment branch.

Live course: https://zk222ac001.github.io/datastrukturer/

CodeViz teaches general programming concepts through interactive examples in **C, C++, Python, Java, JavaScript and C#**. The programming-language selector changes code, downloads, run instructions, arithmetic semantics and the formatting reference. The interface language is a separate choice.

## Course

1. Introduction to computers and programming
2. Data types and variables
3. Program control structures
4. Loops
5. Escape characters & format specifiers (reference)
6. Data structures (interactive lessons)
7. Arrays (standalone interactive lesson)
8. Functions (standalone interactive lesson)
9. Pointers (standalone interactive lesson)
10. Object-Oriented Programming (standalone interactive lesson)
11. File Handling (standalone interactive lesson)
12. Exception Handling (standalone interactive lesson)
13. Unit Testing (standalone interactive lesson)

The four core modules and standalone Arrays/Functions/Pointers/Object-Oriented Programming/File Handling/Exception Handling/Unit Testing lessons contain 37 topics and 216 complete selected-language source examples (36 per programming language, excluding exercise solutions). Existing explanations and the Arrays/Switch/Functions/Pointers/Object-Oriented Programming/File Handling/Exception Handling/Unit Testing titles and summaries are available in Danish, English, Spanish, French, German, Portuguese, Arabic, Urdu, Hindi and Simplified Chinese. The detailed interactive Arrays and Pointers lessons initially use C and English; Switch and Functions use English with the selected language's own syntax and behavior. The detailed OOP tutorial uses Java syntax, with runnable examples and language-specific notes for all six programming languages. File Handling explains general file concepts and shows runnable write/read code in all six languages. Exception Handling compares language mechanisms and demonstrates each language's error-reporting approach. Unit Testing introduces assertions, Arrange–Act–Assert, isolation and test doubles, with runnable checks in all six languages. English fallbacks are explicit. Arabic and Urdu use right-to-left prose; code remains left-to-right.

## Coding assignments

Every one of the 84 course topics and detailed lesson sections has a hands-on assignment with an expected outcome. The separate Data Structures classroom adds an assignment to each of its seven chapters. Open an assignment's example in the existing OneCompiler editor, edit and run it, then compare its output or behavior with the expected outcome shown in the lesson. The selected programming language is used for course assignment starters and the expandable **Solution of code** panel; Data Structures assignments show the chapter's complete example. Input is prefilled where applicable.

Assignments are self-checked: CodeViz does not automatically grade submissions or receive execution results from OneCompiler. Assignment instructions and expected outcomes are in English. The focused coverage is in `tests/assignments.test.cjs` and `tests/browser/assignments.spec.cjs`; run it with `node --test tests/assignments.test.cjs` and `npx playwright test tests/browser/assignments.spec.cjs`.

## Functions lesson (08)

Open `index.html?lang=en&code=c#functions`, or select **08 Functions** from the homepage/sidebar. Eight linked sections explain functions; prototypes, declarations, definitions and calls; logical call stacks/frames; argument passing; pseudo-random generators; storage/lifetime; scope; and recursion. The selected language has five runnable examples with editor/copy/download controls. C prototypes and C11 storage classes are explicitly distinguished from other languages' syntax; C passes pointers by value, C++ and C# support reference parameters, while Java, Python and JavaScript distinguish shared-object mutation from rebinding a caller variable.

The bounded factorial simulation accepts 0–6, shows separate invocation frames, highlights selected-language source, and supports Next/Previous/Reset through calls, the base case and unwinding. It is an educational model, not a physical-memory debugger or arbitrary-code interpreter. Five quiz questions reuse the shared engine; completion/results use per-language browser storage with session fallback. Two self-checked exercises include hints/solutions. Random output is validated by range in local tests rather than a fixed answer; C's simple modulo example documents bias and seeding limitations.

New files: `functions-data.js` (translated discovery/fallback text, native examples and notes), `functions-core.js` (pure logical stack trace), `functions-lesson.js` (tutorial/UI), `tests/functions.test.cjs`, and `tests/browser/functions.spec.cjs`. Integration touches `course.js`, `course.css`, `index.html`, `formatting.html` and its legacy alias `c-formatting.html`. Run the local commands above: `npm test` checks stack boundaries and compiles/runs examples, recursion boundary cases and sum solutions on available toolchains; `npm run test:browser` covers 60 locale/language pairs, entry 08, deep links, stack controls, editor/download payloads, quizzes, progress, storage failures and mobile RTL, alongside existing regressions. There is no runtime dependency, backend, or deployment change.

## Pointers lesson (09)

Open `index.html?lang=en&code=c#pointers`, or select **09 Pointers** from the homepage/sidebar. Five sections explain pointer basics, declaration and initialization, reference-like function arguments (and C's pass-by-value rule), pointers and arrays, and dynamic memory allocation including `malloc`, `calloc`, `realloc` and `free`. The C lesson includes runnable samples, two self-checked exercises, a quiz and a step-by-step symbolic memory simulation with an allocation-failure path. It explicitly distinguishes arrays from pointer variables and teaches allocation checks, object lifetime, bounds, and safe `realloc` usage.

Selected-language examples explain the differences: C and C++ have explicit pointers, while Python, Java, JavaScript and C# use their respective managed references, collections or `ref` parameters rather than C-style pointer operations. Examples can be run, copied or downloaded. The detailed tutorial is in English and C; interface summaries are available in all ten course languages, with an explicit fallback for other selected programming languages.

The pointer lesson assets are `pointers-data.js`, `pointers-core.js` and `pointers-lesson.js`; focused model/data tests are in `tests/pointers.test.cjs` and `tests/pointers-examples.test.cjs`, with browser coverage in `tests/browser/pointers.spec.cjs`. `npm test` validates simulations and compiles/runs the available C and selected-language examples.

## Object-Oriented Programming lesson (10)

Open `index.html?lang=en&code=java#oop`, or select **10 Object-Oriented Programming** from the homepage/sidebar. The Java-based tutorial explains classes and objects, abstraction, encapsulation, constructors, inheritance, polymorphism, and the `public`, `private`, and `protected` access levels, including Java's same-package protected rule. Runnable examples use each of the six selected programming languages, and explain where the features differ. In particular, C does not have built-in classes or access modifiers; Python uses access conventions, and JavaScript private `#` fields do not imply a `protected` keyword.

Five knowledge-check questions, browser-local progress, and a practice challenge round out the lesson. The source and explanations distinguish abstractions from instances, construction from ordinary methods, and runtime dispatch from inheritance alone. Lesson assets are `oop-data.js` and `oop-lesson.js`; `tests/oop-examples.test.cjs` compiles/runs examples where toolchains are available, and `tests/browser/oop.spec.cjs` covers course entry, concepts, quiz/progress, mobile layout, and all 60 locale/programming-language combinations.

## File Handling lesson (11)

Open `index.html?lang=en&code=python#file-handling`, or select **11 File Handling** from the homepage/sidebar. The lesson introduces text-file paths and read/write/append modes, explains how to write and read text, and demonstrates how OOP can encapsulate a path and file operations. Runnable examples cover C, C++, Python, Java, JavaScript (Node.js), and C#. It highlights error checking, overwriting, working-directory behavior, character encoding, and reliable resource cleanup. The C example uses `FILE*` rather than classes, and the JavaScript example uses synchronous Node.js I/O only for the short sequential demonstration.

Five quiz questions, browser-local completion/results, and a practice challenge are included. Lesson assets are `file-handling-data.js` and `file-handling-lesson.js`; `tests/file-handling-examples.test.cjs` runs examples on available toolchains and `tests/browser/file-handling.spec.cjs` covers entry/navigation, deep links, quiz/progress, all language examples and interface locales, and editor payloads.

## Exception Handling lesson (12)

Open `index.html?lang=en&code=python#exception-handling`, or select **12 Exception Handling** from the homepage/sidebar. The lesson explains errors and exceptions, throwing and propagation, specific catch/except handlers, cleanup, and recovery practices. Runnable examples demonstrate all six language tracks. C does not have built-in exceptions or try/catch, so its example explicitly checks an error status; C++, Python, Java, JavaScript and C# demonstrate their respective exception mechanisms. The lesson also discusses Java checked exceptions, asynchronous JavaScript errors, and resource cleanup.

Five quiz questions, browser-local completion/results, and a practice challenge are included. Lesson assets are `exception-handling-data.js` and `exception-handling-lesson.js`; `tests/exception-handling-examples.test.cjs` runs examples on available toolchains and `tests/browser/exception-handling.spec.cjs` covers navigation, concepts, quiz/progress, all language examples, locale fallback and editor payloads.

## Unit Testing lesson (13)

Open `index.html?lang=en&code=python#unit-testing`, or select **13 Unit Testing** from the homepage/sidebar. The lesson introduces focused unit tests, Arrange–Act–Assert, assertions and useful test cases, isolation and test doubles, coverage limitations, and maintainable test practices. Runnable examples check even and odd inputs for all six programming languages and explain common framework choices and assertion caveats for each.

Five quiz questions, browser-local completion/results, and a practice challenge are included. Lesson assets are `unit-testing-data.js` and `unit-testing-lesson.js`; `tests/unit-testing-examples.test.cjs` runs checks on available toolchains and `tests/browser/unit-testing.spec.cjs` covers entry/navigation, concepts, quiz/progress, all language examples and interface locales, and editor payloads.

## Switch statement lesson

Open `index.html?lang=en&code=c#switch`, or select Switch statement from the homepage’s Program control structures list. The dedicated topic is inserted after selection as 3.8; Assignment follows as 3.9. Existing topic indices and URLs are retained, and Arrays remains the standalone entry 07.

The lesson explains the selector, literal case labels, fallback, case exit, shared actions and common mistakes. A bounded educational simulation supports choices 0–3, Next/Previous/Reset, highlighted source, branch selection and output. Toggle the fallback or remove the break after case 1 to explore continuation into case 2 in C, C++, Java's traditional colon syntax, or JavaScript. Python uses Python 3.10+ match/case and no fall-through. C# retains a required case exit and does not offer the implicit fall-through toggle. Source, downloads and OneCompiler payloads always use the selected language; generated programs print a final `After selection` message to show that execution continues afterward.

Five questions reuse the shared quiz engine with language-specific explanations. Completion and results are stored separately for each programming language, with session-memory fallback when storage is blocked. An editor exercise asks students to add a Settings action; expected output and a hint are provided for self-checking, without automatic grading.

New files: `switch-core.js` (pure trace/source generator), `switch-data.js` (ten translated summaries and language-specific notes/references), `switch-lesson.js` (tutorial and interactions), `tests/switch.test.cjs`, `tests/native-program.cjs`, and `tests/browser/switch.spec.cjs`. Narrow edits to `course.js`, `course.css`, and the three course/reference HTML entry points add discovery, routing, topic counts and shared styling. `npm test` compares generated programs with model output in all six languages when the local toolchains are available, covering matching cases, unmatched/default/no-default paths, and supported fall-through. Browser checks cover all 60 locale/programming-language combinations, downloads/editor payloads, quiz/progress separation, mobile RTL, navigation and the existing lessons.

## Arrays lesson

Open `index.html?lang=en&code=c#arrays`, or select Arrays as entry 07 from the homepage or sidebar. The lesson follows the conceptual sequence in [GeeksforGeeks: Arrays in C](https://www.geeksforgeeks.org/c/c-arrays/) using original text, examples and code-based diagrams. Technical details were checked against the C11 draft and Microsoft’s C documentation. It covers declaration, initialization, zero-fill, indexing, updates, traversal, element count, symbolic memory offsets, common mistakes, practical uses, and an introduction to two-dimensional arrays. It does not assume that `int` is four bytes or apply an array’s `sizeof` count formula to a function parameter adjusted to a pointer.

The simulation models five bounded integer cells. Choose full, partial or uninitialized-local initialization, inspect/update an index, and step forward or backward through forward/reverse traversal. Unknown values use `?`; the model blocks uninitialized/out-of-range reads rather than executing unsafe C or inventing an output. Changing the array or traversal direction resets the trace. The diagram shows symbolic offsets, not real memory addresses.

The shared quiz/progress components provide five questions, explanations, retry and browser-only completion/results, stored separately from the for-loop lesson. Two C challenges use the existing editor with expected output, hints and solutions, and remain self-checked. All six programming languages have their own runnable example, download filename and explanation of their array/container differences. The detailed C quiz and simulation are shown only when C is selected; the English fallback is explicit in all ten interface languages.

New files: `arrays-core.js` (pure array model), `arrays-data.js` (localized summaries, six-language examples, questions and exercises), `arrays-lesson.js` (tutorial and UI), `tests/arrays.test.cjs`, `tests/arrays-examples.test.cjs`, and `tests/browser/arrays.spec.cjs`. Narrow changes to `course.js`, `course.css`, and the three course/reference HTML entry points add discovery, preserve original topic indices/URLs, update the displayed topic count, and share responsive lesson styling. The existing GCC test also executes the Arrays C sample and both solutions. Native example tests executed all six language samples against their expected output during development; local tests skip a language if its compiler/runtime is unavailable. C# requires a .NET SDK, Java requires a JDK, and the C++ example requires a C++17 compiler. Run the local test commands above; browser coverage includes all 60 locale/programming-language combinations for Arrays, correct editor payloads/downloads, safe access, traversal navigation, separate progress, storage fallback, and mobile RTL.

- `index.html`: course homepage and modules; direct links such as `index.html?lang=en&code=python#intro` are supported.
- `formatting.html`: escape characters, string formatting and input/output equivalents for the selected language.
- `c-formatting.html`: retained as a working alias for existing links.
- `datastrukturer.html`: existing data-structure lessons and six-language examples.
- `course-data.js`: translations, language metadata and `LANGUAGE_EXAMPLES`.
- `course.js`: interactive labs, navigation, state and downloads.
- `course.css`: responsive layout and print styles.
- `module-one-data.js`: detailed Module 1 lessons and interface text in all ten languages.
- `module-one.js`: original SVG illustrations, hardware trace, library explorer, toy classifier, fan feedback model and sensor-data estimator.
- `code-runner.js`: user-initiated OneCompiler editor integration, code/STDIN transfer and fallback links.

## Running and editing

The lessons and visual models require no build tools or external browser dependencies. The optional online compiler requires an Internet connection to OneCompiler. Download the repository and open `index.html`, keeping the CSS and JavaScript files alongside it. GitHub Pages deploys the main branch.

The concept activities and step-through labs are clearly labelled teaching simulations. “Run real code” opens an embedded OneCompiler editor for the selected example and language. Students can edit code and STDIN, press Run in the editor, and see output or compiler errors on the same page. Code and input are sent to OneCompiler; no API key is placed in this static site. The external editor is loaded only when requested. Copy-source and new-tab fallbacks remain available if embedding is blocked. Downloading and running locally is also supported with the language-specific instructions in the introduction. Requirements: C11/GCC, C++17/G++, Python 3.10+ (the selection example uses match), Java JDK 8+, Node.js 18+, or a .NET SDK. Java downloads use `Main.java`; C# downloads use `Program.cs`.

The code selector is remembered in `ds-code` and can be set with `?code=python` (or c, cpp, java, javascript, csharp). Interface language uses `ds-language` and `?lang=en`. Links carry both choices for storage-restricted environments.

Language differences are intentional: integer division, Python floor division and modulo, Boolean expressions, Python's lack of ++/-- and do-while, managed memory, and each language's input/output and formatting syntax are explained. C printf/scanf reference details remain available when C is selected. The examples use English identifiers and output; lesson explanations use the selected interface language.

## Validation

The 120 C, C++, Python, Java and JavaScript examples were compiled or executed locally, with expected output checked. C# examples were reviewed but could not be executed because this environment did not have a C# runtime. UI checks cover 240 translated module views, 720 formatting demonstrations, language-specific downloads, preserved state, RTL, input boundaries and the legacy reference URL. Downloaded arithmetic programs were compared with the simulator for negative division, modulo and signed zero.

## Module 1 revision

Expanded the first five topics into concept explanations, practical cases and self-checks, informed by the supplied C cookbook. New diagrams are original code-based illustrations; the uploaded PDF and its images are not republished. The course distinguishes language specifications, runtimes, host APIs and third-party libraries. It does not repeat non-portable C type sizes or conflate training with inference.

The fruit classifier is a deliberately limited nearest-centroid teaching model trained from four fixed labelled weights (110/130 g and 170/190 g). A tie at 150 g selects the first group. The fan model applies an explicit 30 °C rule; it is not an AI model or hardware controller. Data storage estimates use 16 bytes per reading and decimal MB/GB, excluding metadata, compression and replication.

The compiler integration follows https://onecompiler.com/apis/embed-editor and the provider’s https://onecompiler.github.io/editor-embed-demo/complex-editor.html example. Messages use an exact destination origin, and incoming messages must match both the OneCompiler origin and the active iframe window. No source is executed in the course page’s JavaScript context. External service availability, compiler versions and editor language are controlled by OneCompiler.

Regression checks cover 240 module views and 720 format demonstrations. Additional checks cover ten translated expanded modules, all five simulations and boundary cases, sixty language/locale compiler payloads, filenames, STDIN, origin validation and editor cleanup.

Live browser verification: Hello World executed successfully in C, C++, Python, Java, JavaScript and C#. The JavaScript input example also produced its expected result using the supplied STDIN in I/O mode. For programs reading input, select I/O before Run; the provider may otherwise use its interactive console.
