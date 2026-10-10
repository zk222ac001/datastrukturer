'use strict';
window.FOR_LESSON_DATA = {
  id: 'for-c-en-v1',
  questions: [
    { prompt: 'Which part runs exactly once when the loop begins?', options: ['Initialization', 'Condition', 'Body', 'Update'], answer: 0, explanation: 'Initialization sets the starting counter once. The condition is checked before every iteration.' },
    { prompt: 'What does this loop print?', code: 'for (int i = 1; i <= 3; ++i) {\n    printf("%d\\n", i);\n}', options: ['0 1 2', '1 2 3', '1 2', '3 2 1'], answer: 1, explanation: 'i starts at 1. The <= condition includes 3. After updating to 4, the condition is false. Each number prints on its own line.' },
    { prompt: 'How many times does the body run?', code: 'for (int i = 5; i < 5; ++i) {\n    printf("%d\\n", i);\n}', options: ['0', '1', '5', 'Forever'], answer: 0, explanation: 'The first condition, 5 < 5, is false. The body and update never run.' },
    { prompt: 'What does this countdown print?', code: 'for (int i = 3; i >= 1; --i) {\n    printf("%d\\n", i);\n}', options: ['1 2 3', '3 2', '3 2 1', '3 2 1 0'], answer: 2, explanation: '--i decreases the counter. The body runs for 3, 2, and 1; the condition is false at 0.' },
    { prompt: 'What is total after the loop?', code: 'int total = 0;\nfor (int i = 1; i <= 4; ++i) {\n    total += i;\n}', options: ['4', '6', '10', '15'], answer: 2, explanation: 'The accumulator adds 1 + 2 + 3 + 4 = 10. It starts at zero before the loop.' }
  ],
  exercises: [
    {
      id: 'even', title: 'Print the even numbers',
      problem: 'Write a C program that prints the even numbers from 2 through 10, one per line. Use a for loop; do not write five separate printf calls.',
      example: 'No input. Start at 2, include 10, and increase the counter by 2.',
      expected: '2\n4\n6\n8\n10\n',
      hint: 'Use i = 2, i <= 10, and i += 2 in the loop header.',
      starter: '#include <stdio.h>\n\nint main(void) {\n    // TODO: print even numbers from 2 through 10.\n    return 0;\n}\n',
      solution: '#include <stdio.h>\n\nint main(void) {\n    for (int i = 2; i <= 10; i += 2) {\n        printf("%d\\n", i);\n    }\n    return 0;\n}\n',
      explanation: 'Adding 2 keeps every counter value even. The inclusive condition prints 10 before stopping at 12.'
    },
    {
      id: 'sum', title: 'Add a sequence',
      problem: 'Set n to 5 and use a for loop to calculate the sum of the integers from 1 through n. Print total = 15. Then change n to 0: the result should be total = 0.',
      example: 'n = 5 → total = 15; n = 0 → total = 0. No keyboard input is needed.',
      expected: 'total = 15\n',
      hint: 'Declare total = 0 before the loop. Add i to total in the body and print after the loop.',
      starter: '#include <stdio.h>\n\nint main(void) {\n    int n = 5;\n    int total = 0;\n    // TODO: accumulate 1 through n and print the total.\n    return 0;\n}\n',
      solution: '#include <stdio.h>\n\nint main(void) {\n    int n = 5;\n    int total = 0;\n    for (int i = 1; i <= n; ++i) {\n        total += i;\n    }\n    printf("total = %d\\n", total);\n    return 0;\n}\n',
      explanation: 'total keeps its value between iterations. When n is zero, 1 <= 0 is false immediately, so total stays zero.'
    }
  ]
};
