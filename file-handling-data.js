'use strict';
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.FILE_HANDLING_DATA = factory();
})(typeof window === 'undefined' ? globalThis : window, () => {
  const locales = {
    en: ['File Handling', 'Write text to files, read it back, and see how object-oriented design can organize file operations.', 'The detailed tutorial explains general file concepts. The selected-language example shows its own file API and resource-handling rules.'],
    da: ['Filhåndtering', 'Skriv tekst til filer, læs den igen, og se hvordan objektorienteret design kan organisere filoperationer.', 'Den detaljerede lektion forklarer generelle filbegreber. Eksemplet viser det valgte sprogs fil-API og håndtering af ressourcer.'],
    es: ['Manejo de archivos', 'Escribe texto en archivos, léelo de nuevo y descubre cómo el diseño orientado a objetos organiza las operaciones con archivos.', 'La lección explica conceptos generales. El ejemplo muestra la API de archivos y la gestión de recursos del lenguaje seleccionado.'],
    fr: ['Gestion des fichiers', 'Écrivez du texte dans des fichiers, relisez-le et découvrez comment la programmation orientée objet organise ces opérations.', 'Le cours explique les concepts généraux. L’exemple montre l’API de fichiers et la gestion des ressources du langage sélectionné.'],
    de: ['Dateiverarbeitung', 'Schreibe Text in Dateien, lies ihn wieder ein und erfahre, wie objektorientiertes Design Dateioperationen organisiert.', 'Das ausführliche Tutorial erklärt allgemeine Dateikonzepte. Das Beispiel zeigt die Datei-API und Ressourcenverwaltung der gewählten Sprache.'],
    pt: ['Manipulação de arquivos', 'Escreva texto em arquivos, leia-o novamente e veja como o design orientado a objetos organiza essas operações.', 'A lição explica conceitos gerais. O exemplo mostra a API de arquivos e a gestão de recursos da linguagem selecionada.'],
    ar: ['التعامل مع الملفات', 'اكتب نصاً في الملفات واقرأه مجدداً وتعلّم كيف ينظم التصميم كائني التوجه عمليات الملفات.', 'يشرح الدرس المفاهيم العامة. يوضح المثال واجهة الملفات وإدارة الموارد في اللغة المحددة.'],
    ur: ['فائل ہینڈلنگ', 'فائل میں متن لکھیں، اسے دوبارہ پڑھیں، اور دیکھیں کہ آبجیکٹ اورینٹڈ ڈیزائن فائل آپریشنز کیسے منظم کرتا ہے۔', 'تفصیلی سبق فائل کے عمومی تصورات سمجھاتا ہے۔ منتخب زبان کی مثال اس کی فائل API اور وسائل کے انتظام کو دکھاتی ہے۔'],
    hi: ['फ़ाइल प्रबंधन', 'फ़ाइलों में टेक्स्ट लिखें, उसे वापस पढ़ें और जानें कि ऑब्जेक्ट-ओरिएंटेड डिज़ाइन फ़ाइल संचालन को कैसे व्यवस्थित करता है।', 'विस्तृत पाठ सामान्य फ़ाइल अवधारणाएँ समझाता है। चुनी हुई भाषा का उदाहरण उसकी फ़ाइल API और संसाधन प्रबंधन दिखाता है।'],
    zh: ['文件处理', '向文件写入文本、读取文本，并了解面向对象设计如何组织文件操作。', '详细课程介绍通用文件概念。所选语言的示例展示其文件 API 和资源管理方式。']
  };
  const notes = {
    c: 'C uses FILE* streams from <stdio.h>. fopen can fail and return NULL, every operation must be checked, and fclose must be called even when an earlier write or read fails. The example uses a fixed file in the process working directory and replaces its contents. C has no built-in classes; file operations use functions rather than class methods.',
    cpp: 'C++ file streams such as std::ofstream and std::ifstream provide RAII: their destructors close the file when each object leaves scope. The class NoteFile encapsulates the path and operations. Opening can fail, so check is_open() and handle errors.',
    python: 'Python open() returns a file object. A with block closes it reliably, including when an exception occurs. The NoteFile class hides the path and exposes write_text/read_text operations. This example explicitly uses UTF-8 and replaces the file contents.',
    java: 'Java uses Path and buffered readers/writers. try-with-resources closes each resource even if an operation throws. NoteFile encapsulates the path and offers a small public interface. IOException is reported to the caller and handled in main.',
    javascript: 'Node.js uses the built-in node:fs module. This example uses synchronous UTF-8 operations for a short sequential demonstration; real servers often prefer asynchronous fs/promises APIs. The class hides the path and exposes writeText/readText methods.',
    csharp: 'C# uses StreamWriter and StreamReader. using declarations dispose and close them at the end of the scope, including on errors. NoteFile encapsulates the path and exposes write/read methods. File operations can throw exceptions, so production code should handle expected I/O errors.'
  };
  const examples = {
    c: {
      note: notes.c,
      code: `#include <stdio.h>

int main(void) {
    const char *path = "codeviz-note.txt";
    const char *message = "Hello from CodeViz!";
    FILE *file = fopen(path, "w");
    if (file == NULL) {
        perror("Could not open file for writing");
        return 1;
    }
    if (fprintf(file, "%s\\n", message) < 0) {
        perror("Could not write file");
        fclose(file);
        return 1;
    }
    if (fclose(file) != 0) {
        perror("Could not close file");
        return 1;
    }
    puts("Saved: Hello from CodeViz!");

    file = fopen(path, "r");
    if (file == NULL) {
        perror("Could not open file for reading");
        return 1;
    }
    char line[128];
    if (fgets(line, sizeof line, file) == NULL) {
        if (ferror(file)) perror("Could not read file");
        else fputs("File is empty\\n", stderr);
        fclose(file);
        return 1;
    }
    if (fclose(file) != 0) {
        perror("Could not close file");
        return 1;
    }
    printf("Read: %s", line);
    return 0;
}
`,
      output: 'Saved: Hello from CodeViz!\nRead: Hello from CodeViz!\n'
    },
    cpp: {
      note: notes.cpp,
      code: `#include <fstream>
#include <iostream>
#include <string>
      #include <utility>

class NoteFile {
private:
    std::string path_;
public:
    explicit NoteFile(std::string path) : path_(std::move(path)) {}

    bool writeText(const std::string& text) const {
        std::ofstream file(path_);
        if (!file.is_open()) return false;
        file << text << '\\n';
        file.flush();
        return file.good();
    }

    bool readText(std::string& text) const {
        std::ifstream file(path_);
        return file.is_open() && static_cast<bool>(std::getline(file, text));
    }
};

int main() {
    NoteFile note("codeviz-note.txt");
    if (!note.writeText("Hello from CodeViz!")) {
        std::cerr << "Could not write file\\n";
        return 1;
    }
    std::cout << "Saved: Hello from CodeViz!\\n";
    std::string text;
    if (!note.readText(text)) {
        std::cerr << "Could not read file\\n";
        return 1;
    }
    std::cout << "Read: " << text << "\\n";
}
`,
      output: 'Saved: Hello from CodeViz!\nRead: Hello from CodeViz!\n'
    },
    python: {
      note: notes.python,
      code: `class NoteFile:
    def __init__(self, path):
        self.__path = path

    def write_text(self, text):
        with open(self.__path, "w", encoding="utf-8") as file:
            file.write(text + "\\n")

    def read_text(self):
        with open(self.__path, "r", encoding="utf-8") as file:
            return file.readline().rstrip("\\n")

note = NoteFile("codeviz-note.txt")
note.write_text("Hello from CodeViz!")
print("Saved: Hello from CodeViz!")
print("Read: " + note.read_text())
`,
      output: 'Saved: Hello from CodeViz!\nRead: Hello from CodeViz!\n'
    },
    java: {
      note: notes.java,
      code: `import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

class NoteFile {
    private final Path path;

    public NoteFile(Path path) {
        this.path = path;
    }

    public void writeText(String text) throws IOException {
        try (BufferedWriter writer = Files.newBufferedWriter(path, StandardCharsets.UTF_8)) {
            writer.write(text);
            writer.newLine();
        }
    }

    public String readText() throws IOException {
        try (BufferedReader reader = Files.newBufferedReader(path, StandardCharsets.UTF_8)) {
            return reader.readLine();
        }
    }
}

public class Main {
    public static void main(String[] args) {
        NoteFile note = new NoteFile(Paths.get("codeviz-note.txt"));
        try {
            note.writeText("Hello from CodeViz!");
            System.out.println("Saved: Hello from CodeViz!");
            System.out.println("Read: " + note.readText());
        } catch (IOException error) {
            System.err.println("File operation failed: " + error.getMessage());
            System.exit(1);
        }
    }
}
`,
      output: 'Saved: Hello from CodeViz!\nRead: Hello from CodeViz!\n'
    },
    javascript: {
      note: notes.javascript,
      code: `const fs = require("node:fs");

class NoteFile {
    #path;

    constructor(path) {
        this.#path = path;
    }

    writeText(text) {
        fs.writeFileSync(this.#path, text + "\\n", "utf8");
    }

    readText() {
        return fs.readFileSync(this.#path, "utf8").trimEnd();
    }
}

const note = new NoteFile("codeviz-note.txt");
note.writeText("Hello from CodeViz!");
console.log("Saved: Hello from CodeViz!");
console.log("Read: " + note.readText());
`,
      output: 'Saved: Hello from CodeViz!\nRead: Hello from CodeViz!\n'
    },
    csharp: {
      note: notes.csharp,
      code: `using System;
using System.IO;
using System.Text;

class NoteFile {
    private readonly string path;

    public NoteFile(string path) {
        this.path = path;
    }

    public void WriteText(string text) {
        using var writer = new StreamWriter(path, false, Encoding.UTF8);
        writer.WriteLine(text);
    }

    public string ReadText() {
        using var reader = new StreamReader(path, Encoding.UTF8);
        return reader.ReadLine() ?? "";
    }
}

class Program {
    static int Main() {
        try {
            var note = new NoteFile("codeviz-note.txt");
            note.WriteText("Hello from CodeViz!");
            Console.WriteLine("Saved: Hello from CodeViz!");
            Console.WriteLine("Read: " + note.ReadText());
            return 0;
        } catch (IOException error) {
            Console.Error.WriteLine("File operation failed: " + error.Message);
            return 1;
        }
    }
}
`,
      output: 'Saved: Hello from CodeViz!\nRead: Hello from CodeViz!\n'
    }
  };
  const questions = [
    { prompt: 'What does opening a text file in write mode usually do?', options: ['Append without changing anything', 'Create it or replace its existing contents', 'Make it read-only', 'Move it to another folder'], answer: 1, explanation: 'Write mode commonly truncates an existing file. Use an append mode when you want to preserve and add to its contents.' },
    { prompt: 'Why should a program close or dispose a file after use?', options: ['To release the operating-system resource and finish buffered output', 'To erase the file', 'To change its encoding', 'To make the path absolute'], answer: 0, explanation: 'Closing releases the handle and ensures buffered writes are completed. Use the language’s resource-management construct where available.' },
    { prompt: 'What does this lesson’s read example do?', options: ['Reads the first line of the text file', 'Reads every file on the computer', 'Deletes the file before reading', 'Reads a keyboard key'], answer: 0, explanation: 'The example reads back the line written earlier and displays it.' },
    { prompt: 'How does the NoteFile class demonstrate encapsulation?', options: ['It hides the path and provides write/read operations', 'It makes every field public', 'It avoids all error handling', 'It stores the text only in a global variable'], answer: 0, explanation: 'The class controls access to its path and exposes a small interface for file operations.' },
    { prompt: 'Where is the example file created?', options: ['In the process working directory', 'Always in the computer’s root directory', 'Inside the source code', 'On a remote website'], answer: 0, explanation: 'A relative path is resolved from the program’s current working directory, which can differ between environments.' }
  ];
  return { locales, notes, examples, questions };
});
