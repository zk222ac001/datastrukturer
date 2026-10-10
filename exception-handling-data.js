'use strict';
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.EXCEPTION_HANDLING_DATA = factory();
})(typeof window === 'undefined' ? globalThis : window, () => {
  const locales = {
    en: ['Exception Handling', 'Learn how programs report, catch, and recover from errors, and how exception support differs by language.', 'The detailed tutorial explains general error-handling ideas. The selected-language example shows the mechanisms available in that language.'],
    da: ['Håndtering af undtagelser', 'Lær hvordan programmer rapporterer, fanger og håndterer fejl, og hvordan understøttelsen varierer mellem sprog.', 'Den detaljerede lektion forklarer generelle idéer om fejlhåndtering. Eksemplet viser mekanismerne i det valgte sprog.'],
    es: ['Manejo de excepciones', 'Aprende cómo los programas notifican, capturan y gestionan errores, y cómo varía este mecanismo entre lenguajes.', 'La lección explica ideas generales sobre el manejo de errores. El ejemplo muestra los mecanismos del lenguaje seleccionado.'],
    fr: ['Gestion des exceptions', 'Découvrez comment les programmes signalent, interceptent et traitent les erreurs, et comment cela varie selon les langages.', 'Le cours explique les principes généraux de gestion des erreurs. L’exemple montre les mécanismes du langage sélectionné.'],
    de: ['Ausnahmen behandeln', 'Lerne, wie Programme Fehler melden, abfangen und behandeln und wie sich die Unterstützung je nach Sprache unterscheidet.', 'Das Tutorial erklärt allgemeine Ideen zur Fehlerbehandlung. Das Beispiel zeigt die Möglichkeiten der ausgewählten Sprache.'],
    pt: ['Tratamento de exceções', 'Aprenda como programas comunicam, capturam e tratam erros e como esse mecanismo varia entre linguagens.', 'A lição explica ideias gerais sobre tratamento de erros. O exemplo mostra os mecanismos da linguagem selecionada.'],
    ar: ['معالجة الاستثناءات', 'تعلّم كيف تُبلغ البرامج عن الأخطاء وتلتقطها وتعالجها، وكيف يختلف ذلك بين لغات البرمجة.', 'يشرح الدرس الأفكار العامة لمعالجة الأخطاء. يوضح المثال آليات اللغة المحددة.'],
    ur: ['استثنائی حالات کا انتظام', 'جانیں کہ پروگرام خرابیوں کی اطلاع کیسے دیتے، پکڑتے اور سنبھالتے ہیں، اور مختلف زبانوں میں یہ طریقہ کیسے بدلتا ہے۔', 'تفصیلی سبق خرابیوں کے انتظام کے عمومی تصورات سمجھاتا ہے۔ مثال منتخب زبان کے طریقے دکھاتی ہے۔'],
    hi: ['अपवाद प्रबंधन', 'जानें कि प्रोग्राम त्रुटियों की सूचना कैसे देते, पकड़ते और संभालते हैं तथा भाषाओं में यह सुविधा कैसे अलग होती है।', 'विस्तृत पाठ त्रुटि प्रबंधन के सामान्य विचार समझाता है। उदाहरण चुनी हुई भाषा के तंत्र दिखाता है।'],
    zh: ['异常处理', '了解程序如何报告、捕获和处理错误，以及不同编程语言对此的支持有何区别。', '详细课程介绍通用错误处理概念。示例展示所选语言提供的机制。']
  };
  const notes = {
    c: 'C does not have built-in exceptions or try/catch. This example uses an explicit status result and checks it at the call site. Return codes, output parameters, and documented error values are common C error-handling techniques; cleanup must be handled along each control-flow path.',
    cpp: 'C++ supports throw and try/catch. This example throws std::invalid_argument for a rejected value and catches that specific type. RAII objects still clean up resources when stack unwinding occurs; do not use exceptions for ordinary control flow.',
    python: 'Python raises exceptions and handles them with try/except. The optional else block runs only when no exception was raised, and finally runs whether the operation succeeded or failed. Catch only errors you can meaningfully handle.',
    java: 'Java uses try/catch/finally. IllegalArgumentException is unchecked; checked exceptions must be declared with throws or handled. The finally block runs as control leaves the try statement, and try-with-resources is preferred for closeable resources.',
    javascript: 'JavaScript uses throw and try/catch/finally. This synchronous example shows the control flow; rejected Promises and async functions need await inside try/catch to handle asynchronous failures.',
    csharp: 'C# uses throw and try/catch/finally. Catch a specific exception when recovery is possible; finally runs during normal exit and stack unwinding. using/using declarations are usually clearer for disposing resources.'
  };
  const examples = {
    c: {
      note: notes.c,
      code: `#include <stdio.h>

int is_positive(int value) {
    return value > 0;
}

int main(void) {
    int value = 0;
    if (!is_positive(value)) {
        puts("Handled: value must be positive");
    }
    puts("Cleanup complete");
    return 0;
}
`,
      output: 'Handled: value must be positive\nCleanup complete\n'
    },
    cpp: {
      note: notes.cpp,
      code: `#include <iostream>
#include <stdexcept>

void require_positive(int value) {
    if (value <= 0) {
        throw std::invalid_argument("value must be positive");
    }
}

int main() {
    try {
        require_positive(0);
    } catch (const std::invalid_argument& error) {
        std::cout << "Handled: " << error.what() << '\\n';
    }
    std::cout << "Cleanup complete\\n";
}
`,
      output: 'Handled: value must be positive\nCleanup complete\n'
    },
    python: {
      note: notes.python,
      code: `def require_positive(value):
    if value <= 0:
        raise ValueError("value must be positive")

try:
    require_positive(0)
except ValueError as error:
    print("Handled: " + str(error))
else:
    print("Value accepted")
finally:
    print("Cleanup complete")
`,
      output: 'Handled: value must be positive\nCleanup complete\n'
    },
    java: {
      note: notes.java,
      code: `public class Main {
    static void requirePositive(int value) {
        if (value <= 0) {
            throw new IllegalArgumentException("value must be positive");
        }
    }

    public static void main(String[] args) {
        try {
            requirePositive(0);
        } catch (IllegalArgumentException error) {
            System.out.println("Handled: " + error.getMessage());
        } finally {
            System.out.println("Cleanup complete");
        }
    }
}
`,
      output: 'Handled: value must be positive\nCleanup complete\n'
    },
    javascript: {
      note: notes.javascript,
      code: `function requirePositive(value) {
    if (value <= 0) {
        throw new Error("value must be positive");
    }
}

try {
    requirePositive(0);
} catch (error) {
    console.log("Handled: " + error.message);
} finally {
    console.log("Cleanup complete");
}
`,
      output: 'Handled: value must be positive\nCleanup complete\n'
    },
    csharp: {
      note: notes.csharp,
      code: `using System;

class Program {
    static void RequirePositive(int value) {
        if (value <= 0) {
            throw new ArgumentOutOfRangeException(nameof(value), "value must be positive");
        }
    }

    static void Main() {
        try {
            RequirePositive(0);
        } catch (ArgumentOutOfRangeException) {
            Console.WriteLine("Handled: value must be positive");
        } finally {
            Console.WriteLine("Cleanup complete");
        }
    }
}
`,
      output: 'Handled: value must be positive\nCleanup complete\n'
    }
  };
  const questions = [
    { prompt: 'What happens when an exception is raised and no matching handler catches it?', options: ['It propagates to the caller or terminates the operation if still unhandled', 'It is always converted to zero', 'The program automatically retries forever', 'The exception is ignored'], answer: 0, explanation: 'An unhandled exception propagates outward. If it reaches the runtime boundary, the operation usually terminates with an error.' },
    { prompt: 'Why should you catch a specific exception type?', options: ['It helps handle only failures the code can meaningfully recover from', 'It catches every possible problem and guarantees recovery', 'It prevents the operation from failing', 'It automatically validates all input'], answer: 0, explanation: 'A narrow handler avoids masking unrelated programming errors and makes recovery behavior explicit.' },
    { prompt: 'What is a finally block typically used for?', options: ['Cleanup that should run as control leaves the try statement', 'Code that runs only when an exception is thrown', 'Declaring a new class', 'Retrying every failed statement'], answer: 0, explanation: 'Finally is intended for cleanup that must happen after success or failure. Resource-specific constructs such as using or try-with-resources are often safer.' },
    { prompt: 'How does the C example handle an invalid value?', options: ['It checks an explicit result because C has no built-in try/catch exceptions', 'It catches a C++ exception', 'It relies on a finally block', 'It silently skips validation'], answer: 0, explanation: 'C commonly reports errors with return codes or other explicit status conventions rather than language-level exceptions.' },
    { prompt: 'Which is a good exception-handling practice?', options: ['Catch errors you can handle, preserve useful details, and let other failures propagate', 'Catch every error and continue as if nothing happened', 'Use exceptions for every ordinary branch', 'Discard all error messages'], answer: 0, explanation: 'Handle failures only when you can respond appropriately. Otherwise preserve the failure information and allow it to reach code that can decide what to do.' }
  ];
  return { locales, notes, examples, questions };
});
