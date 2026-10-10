'use strict';
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.POINTERS_DATA = factory();
})(typeof window === 'undefined' ? globalThis : window, () => {
  const locales = {
    en: ['Pointers', 'Explore addresses, pointer initialization, function arguments, arrays and dynamic memory.', 'The detailed Pointers lesson is in English and C. The example below follows your selected programming language and explains its differences.'],
    da: ['Pointere', 'Udforsk adresser, initialisering af pointere, funktionsargumenter, arrays og dynamisk hukommelse.', 'Den detaljerede lektion om pointere er på engelsk og i C. Eksemplet nedenfor følger dit valgte programmeringssprog og forklarer forskellene.'],
    es: ['Punteros', 'Explora direcciones, inicialización de punteros, argumentos, arreglos y memoria dinámica.', 'La lección detallada sobre punteros está en inglés y C. El ejemplo siguiente usa el lenguaje seleccionado y explica sus diferencias.'],
    fr: ['Pointeurs', 'Découvrez les adresses, l’initialisation des pointeurs, les arguments, les tableaux et la mémoire dynamique.', 'La leçon détaillée sur les pointeurs est en anglais et en C. L’exemple ci-dessous utilise le langage choisi et explique ses différences.'],
    de: ['Zeiger', 'Entdecke Adressen, Zeigerinitialisierung, Funktionsargumente, Arrays und dynamischen Speicher.', 'Die ausführliche Lektion über Zeiger ist auf Englisch und in C. Das folgende Beispiel verwendet die gewählte Programmiersprache und erklärt ihre Unterschiede.'],
    pt: ['Ponteiros', 'Explore endereços, inicialização de ponteiros, argumentos, arrays e memória dinâmica.', 'A lição detalhada sobre ponteiros está em inglês e C. O exemplo abaixo usa a linguagem selecionada e explica as diferenças.'],
    ar: ['المؤشرات', 'استكشف العناوين وتهيئة المؤشرات ومعاملات الدوال والمصفوفات والذاكرة الديناميكية.', 'درس المؤشرات المفصل باللغة الإنجليزية ولغة C. يستخدم المثال أدناه لغة البرمجة التي اخترتها ويشرح الفروق.'],
    ur: ['پوائنٹرز', 'ایڈریس، پوائنٹر کی ابتدا، فنکشن آرگیومنٹس، ایرے اور ڈائنامک میموری سیکھیں۔', 'پوائنٹرز کا تفصیلی سبق انگریزی اور C میں ہے۔ نیچے دی گئی مثال آپ کی منتخب زبان استعمال کرتی ہے اور اس کے فرق سمجھاتی ہے۔'],
    hi: ['पॉइंटर', 'पते, पॉइंटर की शुरुआत, फ़ंक्शन आर्ग्युमेंट, ऐरे और गतिशील मेमोरी सीखें।', 'पॉइंटर का विस्तृत पाठ अंग्रेज़ी और C में है। नीचे का उदाहरण आपकी चुनी हुई भाषा में है और उसके अंतर समझाता है।'],
    zh: ['指针', '学习地址、指针初始化、函数参数、数组和动态内存。', '详细指针课程目前使用英语和 C。下面的示例使用您选择的编程语言，并说明其区别。']
  };
  const notes = {
    definition: 'A C pointer is a value that can refer to an object or function. A pointer variable stores such a value. For an int object, int *p declares a pointer to int. &value obtains the address of value; *p accesses the int that p points to. Changing p changes its target; changing *p changes that target object.',
    initialization: 'Initialize a pointer before using it: int *p = &value; refers to a live int, and int *p = NULL; explicitly has no target. NULL is a null pointer constant, not an object you can dereference. In int *p, the star is part of the declarator; in *p = 20, it dereferences p. Write int *p, *q; when declaring two pointers. int *p, q; declares q as an ordinary int.',
    arguments: 'C passes all arguments by value, including pointers. change(&value) copies the address into the parameter int *p. Writing *p = 20 changes the caller’s int. This is often informally called passing by reference, but C has no reference parameter type. Reassigning the local parameter p alone would not replace the caller’s pointer. Pass a valid pointer to a live object, or handle NULL before dereferencing.',
    arrays: 'An array contains consecutive elements. In most expressions its name converts to a pointer to the first element: int *p = values; is like &values[0]. p[i] and *(p + i) access the same element; adding 1 moves by one element, not one byte. An array is not itself a pointer variable. sizeof values measures the whole array only where values is an actual array; a pointer or adjusted array parameter does not retain its length. Pass the element count separately. You may form a pointer one past the last element, but must not dereference it or move farther outside the array.',
    allocation: 'malloc requests a byte count and leaves the allocated contents uninitialized. calloc requests an element count and element size and zeroes the bytes; for these int examples the elements start at zero. Both may return NULL. Check the result before access, write every malloc element before reading it, and eventually free the allocated block exactly once. Use count * sizeof *values so allocation follows the pointed-to type; no cast is needed for malloc in C. Automatic arrays must not be passed to free.',
    reallocation: 'realloc can grow or shrink an allocated block. Store its result in a temporary pointer. For a nonzero requested size, failure returns NULL and leaves the old allocation intact, so the failure path can still free it. On success use the new pointer and discard every pointer into the old block, even if the numerical address appears unchanged. Existing elements up to the smaller size are preserved; initialize new elements before reading them. Use free to release a block rather than requesting realloc(..., 0).',
    safety: 'The allocation examples use positive counts of 3 or 5 and check count <= SIZE_MAX / sizeof *values before multiplication. For user-supplied counts, also validate the input, reject zero or negative values as appropriate, and enforce a reasonable resource limit. A non-NULL test alone cannot prove that a pointer is valid: freed pointers, pointers to expired locals, and out-of-bounds pointers may be non-NULL. After free, setting your owning pointer to NULL helps prevent its accidental reuse; other aliases remain invalid. Do not read uninitialized pointers, dereference NULL, access a freed block or free a block twice.'
  };
  const examples = {
    c: {
      note: 'C has explicit pointers and manual allocation. change receives a copied int pointer and writes through it. The dynamic block is checked, initialized, read, then freed. The sample uses a positive fixed count; the size check also protects the multiplication.',
      code: `#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

void change(int *p) {
    if (p != NULL) *p = 20;
}

int main(void) {
    int value = 10;
    int *p = &value;
    change(p);
    printf("value = %d\\n", value);

    int values[] = {4, 8, 12};
    int *first = values;
    printf("array[1] = %d\\n", *(first + 1));

    const size_t count = 3;
    int *dynamic = NULL;
    if (count > SIZE_MAX / sizeof *dynamic) return EXIT_FAILURE;
    dynamic = malloc(count * sizeof *dynamic);
    if (dynamic == NULL) {
        fputs("Allocation failed\\n", stderr);
        return EXIT_FAILURE;
    }
    int sum = 0;
    for (size_t i = 0; i < count; ++i) {
        dynamic[i] = (int)i + 1;
        sum += dynamic[i];
    }
    printf("dynamic sum = %d\\n", sum);
    free(dynamic);
    dynamic = NULL;
    return 0;
}
`,
      output: 'value = 20\narray[1] = 8\ndynamic sum = 6\n'
    },
    cpp: {
      note: 'C++ supports explicit pointers; change takes a copied int pointer and writes through it. C++ also has true reference parameters (int &), which are a different feature. A std::vector owns the dynamic collection and frees its storage automatically. Prefer containers and smart pointers for ownership; do not mix malloc/free with new/delete.',
      code: `#include <iostream>
#include <vector>

void change(int *p) {
    if (p != nullptr) *p = 20;
}

int main() {
    int value = 10;
    int *p = &value;
    change(p);
    std::cout << "value = " << value << "\\n";

    int values[] = {4, 8, 12};
    int *first = values;
    std::cout << "array[1] = " << *(first + 1) << "\\n";

    std::vector<int> dynamic;
    for (int i = 1; i <= 3; ++i) dynamic.push_back(i);
    int sum = 0;
    for (int item : dynamic) sum += item;
    std::cout << "dynamic sum = " << sum << "\\n";
}
`,
      output: 'value = 20\narray[1] = 8\ndynamic sum = 6\n'
    },
    python: {
      note: 'Python has no C-style pointer variables or address/dereference operators. Arguments are passed by assignment: the function and caller can share a mutable object. Updating box[0] changes the shared list; rebinding the parameter would not replace the caller’s variable. Python lists are dynamic collections managed by the runtime, not C arrays requiring free.',
      code: `def change(box):
    box[0] = 20

box = [10]
change(box)
print(f"value = {box[0]}")

values = [4, 8, 12]
print(f"array[1] = {values[1]}")

dynamic = []
for i in range(1, 4):
    dynamic.append(i)
print(f"dynamic sum = {sum(dynamic)}")
`,
      output: 'value = 20\narray[1] = 8\ndynamic sum = 6\n'
    },
    java: {
      note: 'Java has managed object references, not C-style pointers or pointer arithmetic. Java passes every argument by value, including references. The copied array reference still reaches the same array, so changing box[0] is visible to the caller. Arrays have a fixed length; ArrayList is the dynamic collection here. Garbage collection manages these objects; no free call is used.',
      code: `import java.util.ArrayList;

public class Main {
    static void change(int[] box) {
        box[0] = 20;
    }

    public static void main(String[] args) {
        int[] box = {10};
        change(box);
        System.out.println("value = " + box[0]);

        int[] values = {4, 8, 12};
        System.out.println("array[1] = " + values[1]);

        ArrayList<Integer> dynamic = new ArrayList<>();
        for (int i = 1; i <= 3; ++i) dynamic.add(i);
        int sum = 0;
        for (int item : dynamic) sum += item;
        System.out.println("dynamic sum = " + sum);
    }
}
`,
      output: 'value = 20\narray[1] = 8\ndynamic sum = 6\n'
    },
    javascript: {
      note: 'JavaScript has no C-style pointer declarations or pointer arithmetic. Arguments are passed by value; an object value can refer to the same object used by the caller. Writing box.value mutates that shared object, while rebinding box would not replace the caller’s binding. Arrays are dynamic objects managed by the runtime; there is no malloc/free in this example.',
      code: `function change(box) {
    box.value = 20;
}

const box = {value: 10};
change(box);
console.log("value = " + box.value);

const values = [4, 8, 12];
console.log("array[1] = " + values[1]);

const dynamic = [];
for (let i = 1; i <= 3; ++i) dynamic.push(i);
const sum = dynamic.reduce((total, item) => total + item, 0);
console.log("dynamic sum = " + sum);
`,
      output: 'value = 20\narray[1] = 8\ndynamic sum = 6\n'
    },
    csharp: {
      note: 'This C# example uses safe ref parameters and managed arrays, with no unsafe pointers. ref int aliases the caller’s variable and must be written at both the declaration and call. An ordinary reference-type argument instead copies an object reference. Arrays have fixed length; List<int> is a dynamic collection. Garbage collection manages its storage. Unsafe C# pointers require a separate explicit unsafe context and are outside this lesson.',
      code: `using System;
using System.Collections.Generic;

class Program {
    static void Change(ref int value) {
        value = 20;
    }

    static void Main() {
        int value = 10;
        Change(ref value);
        Console.WriteLine("value = " + value);

        int[] values = {4, 8, 12};
        Console.WriteLine("array[1] = " + values[1]);

        List<int> dynamic = new List<int>();
        for (int i = 1; i <= 3; ++i) dynamic.Add(i);
        int sum = 0;
        foreach (int item in dynamic) sum += item;
        Console.WriteLine("dynamic sum = " + sum);
    }
}
`,
      output: 'value = 20\narray[1] = 8\ndynamic sum = 6\n'
    }
  };
  const samples = {
    basic: {
      title: 'Pointer definition and initialization',
      note: notes.definition + ' ' + notes.initialization,
      code: `#include <stdio.h>

int main(void) {
    int value = 10;
    int *p = &value; /* p refers to the live int value */
    printf("%d\\n", *p);
    *p = 20;       /* update the pointed-to int */
    printf("%d\\n", value);
    return 0;
}
`, output: '10\n20\n'
    },
    arguments: {
      title: 'Pass an address to a function',
      note: notes.arguments,
      code: `#include <stdio.h>

void changeCopy(int value) {
    value = 20;
    (void)value;
}

void changeOriginal(int *p) {
    if (p != NULL) *p = 20;
}

int main(void) {
    int value = 10;
    changeCopy(value);
    printf("%d\\n", value);
    changeOriginal(&value);
    printf("%d\\n", value);
    return 0;
}
`, output: '10\n20\n'
    },
    arrays: {
      title: 'Pointers and array elements',
      note: notes.arrays,
      code: `#include <stdio.h>

int sum(const int *values, size_t count) {
    int total = 0;
    for (size_t i = 0; i < count; ++i) total += values[i];
    return total;
}

int main(void) {
    int values[] = {4, 8, 12};
    int *p = values; /* points to values[0] */
    size_t count = sizeof values / sizeof values[0];
    printf("%d %d\\n", p[1], *(p + 1));
    printf("sum = %d\\n", sum(values, count));
    return 0;
}
`, output: '8 8\nsum = 24\n'
    },
    allocation: {
      title: 'Allocate, initialize and free memory',
      note: notes.allocation + ' ' + notes.safety,
      code: `#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

int main(void) {
    const size_t count = 3;
    int *values = NULL;
    if (count > SIZE_MAX / sizeof *values) return EXIT_FAILURE;
    values = malloc(count * sizeof *values);
    if (values == NULL) {
        fputs("Allocation failed\\n", stderr);
        return EXIT_FAILURE;
    }
    int *zeros = calloc(count, sizeof *zeros);
    if (zeros == NULL) {
        free(values);
        fputs("Allocation failed\\n", stderr);
        return EXIT_FAILURE;
    }

    int total = 0;
    for (size_t i = 0; i < count; ++i) {
        values[i] = (int)i + 1; /* initialize before reading */
        total += values[i];
    }
    printf("sum = %d\\n", total);
    printf("calloc first = %d\\n", zeros[0]);
    free(zeros);
    free(values);
    zeros = NULL;
    values = NULL;
    return 0;
}
`, output: 'sum = 6\ncalloc first = 0\n'
    },
    reallocation: {
      title: 'Grow a block with a temporary realloc pointer',
      note: notes.reallocation + ' ' + notes.safety,
      code: `#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

int main(void) {
    const size_t count = 3;
    const size_t newCount = 5;
    int *values = NULL;
    if (count > SIZE_MAX / sizeof *values) return EXIT_FAILURE;
    values = malloc(count * sizeof *values);
    if (values == NULL) return EXIT_FAILURE;
    for (size_t i = 0; i < count; ++i) values[i] = (int)i + 1;

    if (newCount > SIZE_MAX / sizeof *values) {
        free(values);
        return EXIT_FAILURE;
    }
    int *grown = realloc(values, newCount * sizeof *values);
    if (grown == NULL) {
        free(values); /* original allocation is still valid on failure */
        fputs("Resize failed\\n", stderr);
        return EXIT_FAILURE;
    }
    values = grown; /* discard the old pointer after success */
    for (size_t i = count; i < newCount; ++i) values[i] = (int)i + 1;
    int total = 0;
    for (size_t i = 0; i < newCount; ++i) total += values[i];
    printf("sum = %d\\n", total);
    free(values);
    values = NULL;
    return 0;
}
`, output: 'sum = 15\n'
    }
  };
  const questions = [
    { prompt: 'After int value = 7; int *p = &value; *p = 9;, what is value?', options: ['7', '9', 'The address of p', 'Always 0'], answer: 1, explanation: '&value initializes p with the address of value. Assigning through *p writes to that same int, so value becomes 9.' },
    { prompt: 'What does int *p = NULL; mean?', options: ['p points to an int containing zero', 'p can safely be dereferenced', 'p currently has no object target', 'p is an ordinary integer'], answer: 2, explanation: 'NULL initializes a null pointer. It has no object target; dereferencing it has undefined behavior. It can be assigned a valid address before use.' },
    { prompt: 'A C function receives int *p and executes *p = 20. Which description is correct?', options: ['C passes every argument by reference', 'The copied pointer can change the caller’s pointed-to int', 'The caller’s int cannot change', 'The function replaces the caller’s pointer variable'], answer: 1, explanation: 'C passes the pointer value by value. The copy still designates the caller’s object, so *p can change that object. Assigning a new value to p itself would only change the local pointer parameter.' },
    { prompt: 'For int a[] = {4, 8, 12}; int *p = a;, what does *(p + 1) produce?', options: ['4', '8', '12', 'The next byte’s address'], answer: 1, explanation: 'p points to a[0]. Pointer arithmetic advances in int elements, so p + 1 points to a[1], whose value is 8.' },
    { prompt: 'For a positive size, realloc returns NULL. What should code using a temporary result pointer do?', options: ['Read the new elements anyway', 'Assume the old block was freed', 'Keep or free the original allocation as appropriate', 'Call free on the old block twice'], answer: 2, explanation: 'A failed realloc with nonzero size leaves the original allocation valid. A temporary result preserves its pointer for recovery or cleanup. On success, use the returned pointer and stop using every old alias.' }
  ];
  const exercises = [
    {
      title: 'Swap two integers through pointers',
      statement: 'Complete swap(int *a, int *b) so that main’s integers exchange values. Use a temporary int and dereference both pointers. Handle NULL arguments without dereferencing them. For a = 3 and b = 9, print the swapped values.',
      expected: 'a = 9, b = 3\n',
      hint: 'Call swap(&a, &b). Save *a before overwriting it, then assign *a = *b and *b = the saved value.',
      starter: `#include <stdio.h>

void swap(int *a, int *b) {
    /* TODO: check pointers, then exchange the pointed-to integers. */
    (void)a;
    (void)b;
}

int main(void) {
    int a = 3, b = 9;
    swap(&a, &b);
    printf("a = %d, b = %d\\n", a, b);
    return 0;
}
`,
      solution: `#include <stdio.h>

void swap(int *a, int *b) {
    if (a == NULL || b == NULL) return;
    int temporary = *a;
    *a = *b;
    *b = temporary;
}

int main(void) {
    int a = 3, b = 9;
    swap(&a, &b);
    printf("a = %d, b = %d\\n", a, b);
    return 0;
}
`
    },
    {
      title: 'Sum a dynamically allocated collection',
      statement: 'Allocate space for five ints using malloc. Check the requested byte count and allocation result. Fill the elements with 2, 4, 6, 8 and 10, calculate their sum, print it, and free the block. Initialize every element before reading it.',
      expected: 'sum = 30\n',
      hint: 'Allocate count * sizeof *values, write values[i] = 2 * ((int)i + 1), add each initialized value, and free(values) before returning.',
      starter: `#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

int main(void) {
    const size_t count = 5;
    int *values = NULL;
    int total = 0;
    /* TODO: validate size, allocate and check the result. */
    /* TODO: initialize each element, then calculate the sum. */
    (void)count;
    printf("sum = %d\\n", total);
    free(values); /* free(NULL) is allowed */
    return 0;
}
`,
      solution: `#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

int main(void) {
    const size_t count = 5;
    int *values = NULL;
    if (count > SIZE_MAX / sizeof *values) return EXIT_FAILURE;
    values = malloc(count * sizeof *values);
    if (values == NULL) {
        fputs("Allocation failed\\n", stderr);
        return EXIT_FAILURE;
    }
    int total = 0;
    for (size_t i = 0; i < count; ++i) {
        values[i] = 2 * ((int)i + 1);
        total += values[i];
    }
    printf("sum = %d\\n", total);
    free(values);
    values = NULL;
    return 0;
}
`
    }
  ];
  const sources = [
    { title: 'WG14 C11 draft: pointer operators (§6.5.3.2), arrays (§6.3.2.1) and allocation (§7.22.3)', url: 'https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf' },
    { title: 'Microsoft: C++ smart pointers and ownership', url: 'https://learn.microsoft.com/en-us/cpp/cpp/smart-pointers-modern-cpp?view=msvc-170' },
    { title: 'Python FAQ: arguments passed by assignment', url: 'https://docs.python.org/3/faq/programming.html#how-do-i-write-a-function-with-output-parameters-call-by-reference' },
    { title: 'Oracle Java tutorial: passing information to methods', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html' },
    { title: 'MDN JavaScript: functions and argument passing', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions' },
    { title: 'Microsoft C#: method parameters and ref', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/method-parameters' }
  ];
  return { locales, notes, examples, samples, questions, exercises, sources };
});
