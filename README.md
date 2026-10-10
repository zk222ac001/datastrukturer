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

The four modules contain 29 topics and 144 complete source examples (24 per programming language). Explanations are available in Danish, English, Spanish, French, German, Portuguese, Arabic, Urdu, Hindi and Simplified Chinese. Arabic and Urdu use right-to-left prose; code remains left-to-right.

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
