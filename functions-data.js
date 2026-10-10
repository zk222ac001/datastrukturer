'use strict';
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.FUNCTIONS_DATA = factory();
})(typeof window === 'undefined' ? globalThis : window, () => {
  const locales = {
    en: ['Functions', 'Learn declarations, calls, stack frames, arguments, random numbers, storage, scope and recursion.'],
    da: ['Funktioner', 'Lær erklæringer, kald, stakrammer, argumenter, tilfældige tal, lagring, scope og rekursion.'],
    es: ['Funciones', 'Aprende declaraciones, llamadas, marcos de pila, argumentos, números aleatorios, almacenamiento, ámbito y recursión.'],
    fr: ['Fonctions', 'Découvrez les déclarations, appels, cadres de pile, arguments, nombres aléatoires, stockage, portée et récursion.'],
    de: ['Funktionen', 'Lerne Deklarationen, Aufrufe, Stackframes, Argumente, Zufallszahlen, Speicherung, Gültigkeitsbereiche und Rekursion.'],
    pt: ['Funções', 'Aprenda declarações, chamadas, quadros de pilha, argumentos, números aleatórios, armazenamento, escopo e recursão.'],
    ar: ['الدوال', 'تعلّم التصريحات والاستدعاءات وإطارات المكدس والمعاملات والأعداد العشوائية والتخزين والنطاق والاستدعاء الذاتي.'],
    ur: ['فنکشنز', 'اعلانات، کالز، اسٹیک فریمز، آرگیومنٹس، بے ترتیب اعداد، ذخیرہ، اسکوپ اور ریکرشن سیکھیں۔'],
    hi: ['फ़ंक्शन', 'घोषणाएँ, कॉल, स्टैक फ़्रेम, आर्ग्युमेंट, यादृच्छिक संख्याएँ, स्टोरेज, स्कोप और रिकर्शन सीखें।'],
    zh: ['函数', '学习声明、调用、栈帧、参数、随机数、存储、作用域和递归。']
  };
  const fallback = {
    en: 'The detailed Functions lesson is in English. Examples follow your selected programming language.',
    da: 'Den detaljerede lektionsdel om funktioner er på engelsk. Eksemplerne følger dit valgte programmeringssprog.',
    es: 'La lección detallada de funciones está en inglés. Los ejemplos usan el lenguaje de programación seleccionado.',
    fr: 'La leçon détaillée sur les fonctions est en anglais. Les exemples utilisent le langage de programmation sélectionné.',
    de: 'Die ausführliche Lektion über Funktionen ist auf Englisch. Die Beispiele verwenden die gewählte Programmiersprache.',
    pt: 'A lição detalhada sobre funções está em inglês. Os exemplos usam a linguagem de programação selecionada.',
    ar: 'درس الدوال المفصل باللغة الإنجليزية. تستخدم الأمثلة لغة البرمجة التي اخترتها.',
    ur: 'فنکشنز کا تفصیلی سبق انگریزی میں ہے۔ مثالیں آپ کی منتخب کردہ پروگرامنگ زبان استعمال کرتی ہیں۔',
    hi: 'फ़ंक्शन का विस्तृत पाठ अंग्रेज़ी में है। उदाहरण आपकी चुनी हुई प्रोग्रामिंग भाषा में हैं।',
    zh: '详细的函数课程目前使用英语。示例使用您选择的编程语言。'
  };
  function wrap(language, definitions, body, extra = '') {
    if (language === 'c') return '#include <stdio.h>\n' + extra + '\n' + definitions + '\nint main(void) {\n' + body + '\n    return 0;\n}\n';
    if (language === 'cpp') return '#include <iostream>\n' + extra + '\n' + definitions + '\nint main() {\n' + body + '\n}\n';
    if (language === 'python' || language === 'javascript') return extra + definitions + '\n' + body + '\n';
    return (language === 'csharp' ? 'using System;\n' : '') + extra + (language === 'java' ? 'public class Main {\n' : 'class Program {\n') + definitions + (language === 'java' ? '\n    public static void main(String[] args) {\n' : '\n    static void Main() {\n') + body + '\n    }\n}\n';
  }
  const print = (language, expression) => ({ c: `    printf("%d\\n", ${expression});`, cpp: `    std::cout << ${expression} << "\\n";`, python: `print(${expression})`, javascript: `console.log(${expression});`, java: `        System.out.println(${expression});`, csharp: `        Console.WriteLine(${expression});` }[language]);
  const definitions = {
    c: 'int add(int a, int b) {\n    return a + b;\n}\n',
    cpp: 'int add(int a, int b) {\n    return a + b;\n}\n',
    python: 'def add(a, b):\n    return a + b\n',
    javascript: 'function add(a, b) {\n    return a + b;\n}\n',
    java: '    static int add(int a, int b) {\n        return a + b;\n    }\n',
    csharp: '    static int add(int a, int b) {\n        return a + b;\n    }\n'
  };
  const passing = {
    c: ['void changeCopy(int x) { x = 20; (void)x; }\nvoid changeOriginal(int *x) { *x = 20; }\n', '    int value = 10;\n    changeCopy(value);\n' + print('c', 'value') + '\n    changeOriginal(&value);\n' + print('c', 'value')],
    cpp: ['void changeCopy(int x) { x = 20; (void)x; }\nvoid changeOriginal(int &x) { x = 20; }\n', '    int value = 10;\n    changeCopy(value);\n' + print('cpp', 'value') + '\n    changeOriginal(value);\n' + print('cpp', 'value')],
    python: ['def change_copy(x):\n    x = 20\n\ndef change_item(box):\n    box[0] = 20\n', 'value = 10\nchange_copy(value)\nprint(value)\nbox = [10]\nchange_item(box)\nprint(box[0])'],
    javascript: ['function changeCopy(x) { x = 20; }\nfunction changeItem(box) { box.value = 20; }\n', 'let value = 10;\nchangeCopy(value);\nconsole.log(value);\nconst box = {value: 10};\nchangeItem(box);\nconsole.log(box.value);'],
    java: ['    static void changeCopy(int x) { x = 20; }\n    static void changeItem(int[] box) { box[0] = 20; }\n', '        int value = 10;\n        changeCopy(value);\n        System.out.println(value);\n        int[] box = {10};\n        changeItem(box);\n        System.out.println(box[0]);'],
    csharp: ['    static void changeCopy(int x) { x = 20; }\n    static void changeOriginal(ref int x) { x = 20; }\n', '        int value = 10;\n        changeCopy(value);\n        Console.WriteLine(value);\n        changeOriginal(ref value);\n        Console.WriteLine(value);']
  };
  const recursive = {
    c: 'int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n',
    cpp: 'int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n',
    python: 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n',
    javascript: 'function factorial(n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n',
    java: '    static int factorial(int n) {\n        if (n <= 1) return 1;\n        return n * factorial(n - 1);\n    }\n',
    csharp: '    static int factorial(int n) {\n        if (n <= 1) return 1;\n        return n * factorial(n - 1);\n    }\n'
  };
  const counters = {
    c: 'int nextCount(void) {\n    static int count = 0;\n    return ++count;\n}\n',
    cpp: 'int nextCount() {\n    static int count = 0;\n    return ++count;\n}\n',
    python: 'def make_counter():\n    count = 0\n    def next_count():\n        nonlocal count\n        count += 1\n        return count\n    return next_count\n\nnextCount = make_counter()\n',
    javascript: 'function makeCounter() {\n    let count = 0;\n    return function() { return ++count; };\n}\nconst nextCount = makeCounter();\n',
    java: '    static int count = 0;\n    static int nextCount() { return ++count; }\n',
    csharp: '    static int count = 0;\n    static int nextCount() { return ++count; }\n'
  };
  const random = {
    c: ['#include <stdlib.h>\n#include <time.h>\n', '    srand((unsigned)time(NULL));\n    int die = 1 + rand() % 6;\n' + print('c', 'die')],
    cpp: ['#include <random>\n', '    std::mt19937 generator(std::random_device{}());\n    std::uniform_int_distribution<int> die(1, 6);\n' + print('cpp', 'die(generator)')],
    python: ['import random\n\n', 'print(random.randint(1, 6))'],
    javascript: ['', 'console.log(1 + Math.floor(Math.random() * 6));'],
    java: ['import java.util.Random;\n', '        Random generator = new Random();\n        System.out.println(1 + generator.nextInt(6));'],
    csharp: ['', '        Random generator = new Random();\n        Console.WriteLine(generator.Next(1, 7));']
  };
  const notes = {
    c: {
      declaration: 'A prototype is a declaration that describes the return type and parameter types before a call. int add(int a, int b); has no body; parameter names may be omitted. The definition supplies the body. In this C11 lesson, use (void) for a no-parameter function, rather than the old unspecified-parameter form ().',
      arguments: 'C passes every argument by value. changeCopy receives a copy of the integer. changeOriginal receives a copied pointer: &value gives the address, and *x writes to the caller’s object. This achieves reference-like mutation, but is not a C reference parameter. Only pass a valid pointer to a live object.',
      storage: 'C11 storage-class specifiers include auto, register, static, extern and _Thread_local; typedef is also classified as a storage-class specifier but defines a type alias. A block-local ordinary variable has automatic storage duration. A static local exists for the whole program and keeps its value between calls; a file-scope static name has internal linkage. extern can declare a name defined elsewhere. register is a hint, not a speed guarantee; _Thread_local gives each thread its own object. These properties are different from scope.',
      scope: 'C has block, file, function (labels), and function-prototype scope. Parameters and locals are visible within their function/block; a file-scope declaration is visible after its declaration in that file. An inner declaration can hide an outer name. A static local keeps its value but its name remains block-scoped. Never return a pointer to an automatic local after its lifetime ends.',
      random: 'Seed rand once at program start with srand, not on each call. A fixed seed repeats the sequence on the same implementation. time(NULL) gives a varying seed, but runs in the same second may repeat. rand() % 6 is a simple teaching example and can introduce modulo bias; it is not a fairness or security guarantee.'
    },
    cpp: {
      declaration: 'C++ supports a separate declaration such as int add(int a, int b); and a definition with a body. This example defines add before main, which also declares it. A call uses add(3, 4); the return value is an int.',
      arguments: 'An int parameter is a copy. An int & parameter is an alias for the caller’s integer, so assigning x changes value. This is actual C++ pass by reference. const int & can provide read-only access through the reference.',
      storage: 'Automatic locals normally end their lifetime when the block exits. A static local retains its value across calls; namespace-scope static affects linkage. extern declares an externally linked name, and thread_local gives per-thread storage. Unlike C11, auto normally asks C++ to deduce a type. The counter uses a static local.',
      scope: 'Blocks, functions, classes and namespaces establish name lookup contexts. An inner local may hide an outer name. Scope tells you where a name can be used; object lifetime tells you when the object exists. Do not return a reference to a local whose lifetime has ended.',
      random: 'The example combines a mt19937 pseudo-random engine with uniform_int_distribution over the inclusive range 1–6. Seed the engine once. A fixed engine seed helps reproduce tests; random_device is implementation-dependent. This engine is not intended for security tokens.'
    },
    python: {
      declaration: 'def creates a function object and binds its name when the definition is executed. There is no C-style prototype. The definition must have executed before the call. Parameters a and b receive the objects supplied by add(3, 4). Type hints are optional and do not enforce types by themselves.',
      arguments: 'Python passes objects by assignment (often called object sharing). Rebinding x to 20 does not rebind the caller’s value. Mutating box[0] changes the same list visible to the caller. This is not a C++ reference to the caller’s variable. Integers are immutable.',
      storage: 'Python does not use C storage-class specifiers. The counter uses a closure: the nested function retains access to count, and nonlocal allows rebinding that enclosing name. Object lifetime depends on references and memory management, not simply leaving a function.',
      scope: 'Lookup commonly follows local, enclosing, global, then built-in scopes. Assignment in a function normally makes a name local; global and nonlocal change the binding target. Ordinary if/for blocks do not create a new local scope. Prefer returning results rather than relying on globals.',
      random: 'random.randint(1, 6) includes both endpoints. Seeding the generator can make a run repeatable. The random module is for simulation and games; use secrets for security-sensitive randomness.'
    },
    javascript: {
      declaration: 'A function declaration includes its body; there is no separate C-style prototype. This example uses function add(a, b). Function declarations are hoisted in their scope; function expressions assigned to const are usable only after initialization. Do not confuse this with an object’s prototype.',
      arguments: 'JavaScript passes arguments by value. A number is copied; rebinding x does not change the caller’s variable. For an object, the copied value refers to the same object, so changing box.value is visible to the caller. Replacing the parameter with a new object would not replace the caller’s binding.',
      storage: 'JavaScript does not have C storage classes. let and const declare bindings; const prevents rebinding, not mutation of an object. A closure retains access to an enclosing lexical environment. The counter uses that environment instead of a static local.',
      scope: 'let and const are block-scoped; var is function-scoped in functions. Nested functions can access enclosing bindings. Names in the temporal dead zone cannot be read before initialization. Inner bindings can hide outer ones; avoid accidental global variables.',
      random: 'Math.random produces a number from 0 inclusive to 1 exclusive. Scaling, flooring, and adding 1 produces 1–6. There is no standard seed parameter for Math.random. Use Web Crypto when security-sensitive randomness is required.'
    },
    java: {
      declaration: 'Java defines methods inside classes. static int add(int a, int b) supplies the signature and body; there is no separate C-style prototype. These static methods can be called from main without creating an instance. Methods may appear later in the class.',
      arguments: 'Java always passes arguments by value, including object references. An int is copied. An array reference is also copied, but both references refer to the same array, so box[0] mutation is visible. Reassigning box would not reassign the caller’s variable; Java does not provide C++-style reference parameters.',
      storage: 'Java does not use C storage classes. A static field belongs to the class rather than an individual instance. Locals belong to a method/block and must be definitely assigned before use. The counter is a class field, not a C-style static local.',
      scope: 'A local’s scope extends from its declaration within its block; parameters are visible in the method body. Fields are members of a class and can be qualified to avoid ambiguity. Access modifiers such as private restrict access separately from local scope.',
      random: 'Random.nextInt(6) gives 0–5, so add 1 for a die. A fixed Random seed can reproduce a sequence. Random is not a security generator; use SecureRandom for that purpose.'
    },
    csharp: {
      declaration: 'C# defines methods with a return type, name, parameters and body. These static methods belong to the class and can be called from Main. There is no need for a separate C-style prototype, and methods may appear later in the class.',
      arguments: 'C# normally passes arguments by value. int is copied. ref int explicitly aliases the caller’s variable, and ref must appear at the call as well. Reference-type arguments passed normally copy the object reference: mutation of the object differs from replacing the caller’s variable. out and in have additional rules.',
      storage: 'C# does not use C storage-class specifiers. A static field belongs to the type rather than an instance. Locals must be definitely assigned before use; static fields retain class-level state. The counter is a field, not a C-style static local.',
      scope: 'Parameters and local variables are used within their declaration spaces and blocks. Fields belong to a type; access modifiers control who may access members. C# restricts overlapping local names, so C-style inner-local shadowing examples are not interchangeable.',
      random: 'Random.Next(1, 7) includes 1 and excludes 7. Keep a generator rather than recreating it for every draw. A fixed seed helps repeat tests on a compatible runtime; Random is not for security-sensitive values.'
    }
  };
  const examples = {};
  for (const language of Object.keys(notes)) {
    const basic = language === 'c'
      ? '#include <stdio.h>\n\nint add(int a, int b); /* prototype / declaration */\n\nint main(void) {\n    int result = add(3, 4); /* call: arguments 3 and 4 */\n    printf("%d\\n", result);\n    return 0;\n}\n\n' + definitions.c
      : wrap(language, definitions[language], print(language, 'add(3, 4)'));
    examples[language] = {
      basic: { code: basic, output: '7\n' },
      arguments: { code: wrap(language, ...passing[language]), output: '10\n20\n' },
      storage: { code: wrap(language, counters[language], print(language, 'nextCount()') + '\n' + print(language, 'nextCount()')), output: '1\n2\n' },
      random: { code: wrap(language, '', random[language][1], random[language][0]), output: null },
      recursion: { code: wrap(language, recursive[language], print(language, 'factorial(5)')), output: '120\n' }
    };
  }
  const sections = ['What is a function?', 'Prototype, declaration and call', 'Call stack and stack frames', 'Arguments: value and reference', 'Random number generators', 'Storage classes and lifetime', 'Scope rules', 'Recursive functions'];
  return { locales, fallback, notes, examples, sections };
});
