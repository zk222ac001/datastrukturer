'use strict';
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.UNIT_TESTING_DATA = factory();
})(typeof window === 'undefined' ? globalThis : window, () => {
  const locales = {
    en: ['Unit Testing', 'Learn to test one small piece of a program at a time, check expected results, and build reliable tests.', 'The detailed tutorial explains general testing ideas. The selected-language example shows a small test suite using that language’s assertions.'],
    da: ['Enhedstest', 'Lær at teste en lille del af et program ad gangen, kontrollere forventede resultater og skrive pålidelige tests.', 'Den detaljerede lektion forklarer generelle testidéer. Eksemplet viser et lille testsæt med det valgte sprogs assertions.'],
    es: ['Pruebas unitarias', 'Aprende a probar una pequeña parte del programa cada vez, comprobar los resultados esperados y crear pruebas fiables.', 'La lección explica conceptos generales. El ejemplo muestra un pequeño conjunto de pruebas con las aserciones del lenguaje seleccionado.'],
    fr: ['Tests unitaires', 'Apprenez à tester une petite partie du programme à la fois, à vérifier les résultats attendus et à créer des tests fiables.', 'Le cours explique les principes généraux. L’exemple montre un petit ensemble de tests avec les assertions du langage sélectionné.'],
    de: ['Unit-Tests', 'Lerne, jeweils einen kleinen Programmteil zu testen, erwartete Ergebnisse zu prüfen und zuverlässige Tests zu schreiben.', 'Das Tutorial erklärt allgemeine Testideen. Das Beispiel zeigt eine kleine Testsuite mit den Assertions der ausgewählten Sprache.'],
    pt: ['Testes unitários', 'Aprenda a testar uma pequena parte do programa de cada vez, verificar resultados esperados e criar testes confiáveis.', 'A lição explica conceitos gerais. O exemplo mostra um pequeno conjunto de testes usando as asserções da linguagem selecionada.'],
    ar: ['اختبار الوحدات', 'تعلّم اختبار جزء صغير من البرنامج في كل مرة والتحقق من النتائج المتوقعة وكتابة اختبارات موثوقة.', 'يشرح الدرس مفاهيم الاختبار العامة. يوضح المثال مجموعة اختبارات صغيرة باستخدام تأكيدات اللغة المحددة.'],
    ur: ['یونٹ ٹیسٹنگ', 'سیکھیں کہ پروگرام کے ایک چھوٹے حصے کو الگ سے کیسے آزمائیں، متوقع نتائج کیسے جانچیں اور قابلِ اعتماد ٹیسٹ کیسے لکھیں۔', 'تفصیلی سبق ٹیسٹنگ کے عمومی تصورات سمجھاتا ہے۔ مثال منتخب زبان کے assertions سے ایک چھوٹا ٹیسٹ سیٹ دکھاتی ہے۔'],
    hi: ['यूनिट टेस्टिंग', 'सीखें कि प्रोग्राम के छोटे हिस्से को अलग से कैसे जाँचें, अपेक्षित परिणाम कैसे सत्यापित करें और भरोसेमंद टेस्ट कैसे लिखें।', 'विस्तृत पाठ सामान्य परीक्षण अवधारणाएँ समझाता है। उदाहरण चुनी हुई भाषा के assertions से छोटा परीक्षण समूह दिखाता है।'],
    zh: ['单元测试', '学习如何一次测试程序的一小部分、检查预期结果并编写可靠的测试。', '详细课程介绍通用测试概念。示例使用所选语言的断言展示一个小型测试集。']
  };
  const notes = {
    c: 'This self-contained C example uses assert from <assert.h>. An assertion that fails stops the program with a nonzero status. Assertions are disabled when NDEBUG is defined, so production test suites should use a dedicated test framework and build configuration.',
    cpp: 'This self-contained C++ example uses assert from <cassert>. A failed assertion stops the program. Larger projects commonly use a framework such as GoogleTest or Catch2 to discover, organize, and report tests.',
    python: 'Python’s assert statement checks a condition and raises AssertionError when it is false. The built-in unittest framework or pytest adds test discovery, setup, fixtures, and useful reports; do not run production tests with Python optimization that removes assert statements.',
    java: 'This dependency-free Java example throws AssertionError when an expectation is false, so checks stay active regardless of the JVM assertion flag. Real projects commonly use JUnit or TestNG for discovery, fixtures, and reports.',
    javascript: 'Node.js provides the built-in node:assert/strict module for comparisons. Its node:test module can discover and run suites; this small program calls assertions directly so the expected output is easy to follow.',
    csharp: 'This dependency-free C# example throws an exception when an expectation is false. Production projects commonly use a test framework such as xUnit, NUnit, or MSTest for discovery, fixtures, and reports.'
  };
  const examples = {
    c: {
      note: notes.c,
      code: `#include <assert.h>
#include <stdio.h>

int is_even(int value) {
    return value % 2 == 0;
}

int main(void) {
    assert(is_even(4));
    puts("PASS even number");
    assert(!is_even(5));
    puts("PASS odd number");
    return 0;
}
`,
      output: 'PASS even number\nPASS odd number\n'
    },
    cpp: {
      note: notes.cpp,
      code: `#include <cassert>
#include <iostream>

bool isEven(int value) {
    return value % 2 == 0;
}

int main() {
    assert(isEven(4));
    std::cout << "PASS even number\\n";
    assert(!isEven(5));
    std::cout << "PASS odd number\\n";
}
`,
      output: 'PASS even number\nPASS odd number\n'
    },
    python: {
      note: notes.python,
      code: `def is_even(value):
    return value % 2 == 0

def test_even_number():
    assert is_even(4)

def test_odd_number():
    assert not is_even(5)

test_even_number()
print("PASS even number")
test_odd_number()
print("PASS odd number")
`,
      output: 'PASS even number\nPASS odd number\n'
    },
    java: {
      note: notes.java,
      code: `public class Main {
    static boolean isEven(int value) {
        return value % 2 == 0;
    }

    static void check(boolean condition) {
        if (!condition) {
            throw new AssertionError("Test failed");
        }
    }

    public static void main(String[] args) {
        check(isEven(4));
        System.out.println("PASS even number");
        check(!isEven(5));
        System.out.println("PASS odd number");
    }
}
`,
      output: 'PASS even number\nPASS odd number\n'
    },
    javascript: {
      note: notes.javascript,
      code: `const assert = require("node:assert/strict");

function isEven(value) {
    return value % 2 === 0;
}

assert.equal(isEven(4), true);
console.log("PASS even number");
assert.equal(isEven(5), false);
console.log("PASS odd number");
`,
      output: 'PASS even number\nPASS odd number\n'
    },
    csharp: {
      note: notes.csharp,
      code: `using System;

class Program {
    static bool IsEven(int value) {
        return value % 2 == 0;
    }

    static void Check(bool condition) {
        if (!condition) {
            throw new InvalidOperationException("Test failed");
        }
    }

    static void Main() {
        Check(IsEven(4));
        Console.WriteLine("PASS even number");
        Check(!IsEven(5));
        Console.WriteLine("PASS odd number");
    }
}
`,
      output: 'PASS even number\nPASS odd number\n'
    }
  };
  const questions = [
    { prompt: 'What is the main goal of a unit test?', options: ['Check one small piece of behavior independently', 'Prove the entire program has no bugs', 'Measure only the application’s speed', 'Replace all manual testing'], answer: 0, explanation: 'A unit test checks a focused behavior, making failures easier to locate and understand. Tests reduce risk but cannot prove that software has no defects.' },
    { prompt: 'In Arrange–Act–Assert, what happens in the Act step?', options: ['Call the behavior being tested', 'Create all project files', 'Compare test coverage percentages', 'Delete the expected result'], answer: 0, explanation: 'Arrange prepares inputs and dependencies, Act invokes the behavior, and Assert checks the outcome.' },
    { prompt: 'What should happen when an assertion fails?', options: ['The test run should report a failure rather than a pass', 'The test should silently continue as successful', 'The expected value should change automatically', 'All later tests must be skipped by definition'], answer: 0, explanation: 'A failed check must be visible as a failure so developers can fix the behavior or the test expectation.' },
    { prompt: 'Why keep a unit test focused and isolated?', options: ['So a failure points to a small behavior instead of unrelated setup or external systems', 'So it can depend on production databases', 'So it never needs assertions', 'So the test always passes'], answer: 0, explanation: 'Tests that control their inputs and dependencies are repeatable and make failures easier to diagnose.' },
    { prompt: 'What does code coverage tell you?', options: ['Which code was exercised, but not whether its behavior was tested correctly', 'That every possible defect has been found', 'That all assertions are meaningful', 'How readable the test names are'], answer: 0, explanation: 'Coverage is a useful signal about executed code, not proof of correctness; strong assertions and well-chosen cases still matter.' }
  ];
  return { locales, notes, examples, questions };
});
