# C programming and data structures

Live course: https://zk222ac001.github.io/datastrukturer/

- `index.html`: C course homepage and 29 lessons across four modules.
- `c-formatting.html`: dedicated escape-character and printf/scanf reference.
- `datastrukturer.html`: original interactive data-structures lessons, preserved with links to the course.
- `course.css`: shared responsive course styling.
- `course.js`: navigation, simulations, code copying and downloads.
- `course-data.js`: ten-language lesson content and 24 complete C11 examples.

Languages: Danish, English, Spanish, French, German, Portuguese, Arabic, Urdu, Hindi and Simplified Chinese. The language selector persists the choice when browser storage is available; page links also carry `?lang=xx`. Arabic and Urdu use right-to-left text while code remains left-to-right.

The course covers computers and C, libraries, AI, embedded systems, data science, compilation, Hello World, data types, variables, memory, input/output, arithmetic, decisions, truth tables, algorithms, pseudocode, flowcharts, selection, assignment and loops.

## Running and editing

No build tools or external JavaScript dependencies are required. Download the repository and open `index.html`, keeping the adjacent CSS and JavaScript files in place. The data-structures page also works as a standalone HTML file. GitHub Pages deploys the repository's main branch.

Edit translations and C examples in `course-data.js`; lesson identifiers and module ranges are shared by all languages. The browser activities are teaching simulations, not C compilation. Download a `.c` example and compile it with a local compiler, for example:

```sh
gcc -std=c11 -Wall -Wextra -Wpedantic hello.c -o hello
./hello
```

Examples were compiled with GCC in C11 mode with warnings treated as errors, and expected output was checked. Formatted numeric input examples assume representable input; the lessons explain using `fgets` and checked conversions for arbitrary input. Technical reference: the public WG14 N1570 C11 draft.
