# CodeViz — Learn programming with Visualization

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

## Running and editing

No build tools or external browser dependencies are required. Download the repository and open `index.html`, keeping the CSS and JavaScript files alongside it. GitHub Pages deploys the main branch.

The browser activities are teaching simulations, not online compilers. Download the selected example and follow the language-specific run instructions in the introduction. Requirements: C11/GCC, C++17/G++, Python 3.10+ (the selection example uses match), Java JDK 8+, Node.js 18+, or a .NET SDK. Java downloads use `Main.java`; C# downloads use `Program.cs`.

The code selector is remembered in `ds-code` and can be set with `?code=python` (or c, cpp, java, javascript, csharp). Interface language uses `ds-language` and `?lang=en`. Links carry both choices for storage-restricted environments.

Language differences are intentional: integer division, Python floor division and modulo, Boolean expressions, Python's lack of ++/-- and do-while, managed memory, and each language's input/output and formatting syntax are explained. C printf/scanf reference details remain available when C is selected. The examples use English identifiers and output; lesson explanations use the selected interface language.

## Validation

The 120 C, C++, Python, Java and JavaScript examples were compiled or executed locally, with expected output checked. C# examples were reviewed but could not be executed because this environment did not have a C# runtime. UI checks cover 240 translated module views, 720 formatting demonstrations, language-specific downloads, preserved state, RTL, input boundaries and the legacy reference URL. Downloaded arithmetic programs were compared with the simulator for negative division, modulo and signed zero.
