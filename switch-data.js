'use strict';
window.SWITCH_DATA = {
  locales: {
    da: ['Switch-sætning', 'Vælg mellem flere handlinger ud fra én værdi. Lær case, default og break.', 'Den detaljerede lektion er på engelsk. Kode og simulation følger dit valgte programmeringssprog.'],
    en: ['Switch statement', 'Choose between several actions using one value. Learn case, default, and break.', 'The detailed lesson is in English. Code and simulation follow your selected programming language.'],
    es: ['Sentencia switch', 'Elige entre varias acciones según un valor. Aprende case, default y break.', 'La lección detallada está en inglés. El código y la simulación usan el lenguaje de programación seleccionado.'],
    fr: ['Instruction switch', 'Choisissez une action selon une valeur. Découvrez case, default et break.', 'La leçon détaillée est en anglais. Le code et la simulation utilisent le langage de programmation sélectionné.'],
    de: ['Switch-Anweisung', 'Wähle eine Aktion anhand eines Wertes. Lerne case, default und break.', 'Die ausführliche Lektion ist auf Englisch. Code und Simulation verwenden die gewählte Programmiersprache.'],
    pt: ['Instrução switch', 'Escolha uma ação a partir de um valor. Aprenda case, default e break.', 'A lição detalhada está em inglês. O código e a simulação usam a linguagem de programação selecionada.'],
    ar: ['عبارة switch', 'اختر إجراءً حسب قيمة واحدة. تعلّم case وdefault وbreak.', 'الدرس المفصل باللغة الإنجليزية. يستخدم الكود والمحاكاة لغة البرمجة التي اخترتها.'],
    ur: ['switch بیان', 'ایک قدر کی بنیاد پر عمل منتخب کریں۔ case، default اور break سیکھیں۔', 'تفصیلی سبق انگریزی میں ہے۔ کوڈ اور سمولیشن آپ کی منتخب کردہ پروگرامنگ زبان استعمال کرتے ہیں۔'],
    hi: ['switch कथन', 'एक मान के आधार पर कार्रवाई चुनें। case, default और break सीखें।', 'विस्तृत पाठ अंग्रेज़ी में है। कोड और सिमुलेशन आपकी चुनी हुई प्रोग्रामिंग भाषा में हैं।'],
    zh: ['switch 语句', '根据一个值选择操作，学习 case、default 和 break。', '详细课程使用英语。代码和模拟使用您选择的编程语言。']
  },
  notes: {
    c: 'C switch uses an integer or enum value and constant integer case labels. Character constants also work. Strings and floating-point values cannot be used as C switch selectors. break leaves the switch; omitting it allows execution to continue into the next case.',
    cpp: 'C++ switch supports integral and enumeration selectors. The example uses the traditional case syntax; break leaves the switch. The C++17 [[fallthrough]] attribute documents intentional continuation but does not cause it.',
    java: 'This example uses the traditional Java case-with-colon syntax supported by JDK 8+. Without break, execution can fall through. Modern arrow-style switch rules behave differently; they are not used here.',
    javascript: 'JavaScript switch compares the selector with case values using strict equality. The numeric cases here match numeric choices. A string "1" would not match case 1. Without break, execution can continue into the following case.',
    python: 'Python has no switch statement. Python 3.10+ offers match/case for structural pattern matching. Here the patterns are literal integers, and case _ is the wildcard fallback. A matching block does not fall through, and it does not need break.',
    csharp: 'C# switch supports more types and patterns than C. A nonempty switch section must end with a valid control transfer such as break, return, or throw; it cannot implicitly fall into the next section. This lesson uses break, so the fall-through option is unavailable.'
  },
  sources: {
    c: 'https://learn.microsoft.com/en-us/cpp/c-language/switch-statement-c?view=msvc-170',
    cpp: 'https://learn.microsoft.com/en-us/cpp/cpp/switch-statement-cpp?view=msvc-170',
    java: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html',
    javascript: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch',
    python: 'https://docs.python.org/3/tutorial/controlflow.html#match-statements',
    csharp: 'https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/selection-statements'
  }
};
