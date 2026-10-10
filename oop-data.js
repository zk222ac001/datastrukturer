'use strict';
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.OOP_DATA = factory();
})(typeof window === 'undefined' ? globalThis : window, () => {
  const locales = {
    en: ['Object-Oriented Programming', 'Learn classes, objects, abstraction, encapsulation, constructors, inheritance, polymorphism and access modifiers.', 'The detailed tutorial uses Java. The selected-language example explains how object-oriented programming works in that language.'],
    da: ['Objektorienteret programmering', 'Lær klasser, objekter, abstraktion, indkapsling, konstruktører, arv, polymorfi og adgangsmodifikatorer.', 'Den detaljerede lektion bruger Java. Eksemplet på det valgte sprog forklarer objektorientering i det sprog.'],
    es: ['Programación orientada a objetos', 'Aprende clases, objetos, abstracción, encapsulación, constructores, herencia, polimorfismo y modificadores de acceso.', 'La lección detallada usa Java. El ejemplo del lenguaje seleccionado explica la programación orientada a objetos en ese lenguaje.'],
    fr: ['Programmation orientée objet', 'Découvrez les classes, objets, abstraction, encapsulation, constructeurs, héritage, polymorphisme et modificateurs d’accès.', 'Le cours détaillé utilise Java. L’exemple du langage sélectionné explique la programmation orientée objet dans ce langage.'],
    de: ['Objektorientierte Programmierung', 'Lerne Klassen, Objekte, Abstraktion, Kapselung, Konstruktoren, Vererbung, Polymorphie und Zugriffsmodifizierer.', 'Das ausführliche Tutorial verwendet Java. Das Beispiel der gewählten Sprache erklärt die objektorientierte Programmierung in dieser Sprache.'],
    pt: ['Programação orientada a objetos', 'Aprenda classes, objetos, abstração, encapsulamento, construtores, herança, polimorfismo e modificadores de acesso.', 'A lição detalhada usa Java. O exemplo da linguagem selecionada explica a programação orientada a objetos nessa linguagem.'],
    ar: ['البرمجة كائنية التوجه', 'تعلّم الأصناف والكائنات والتجريد والتغليف والبناة والوراثة وتعدد الأشكال ومحددات الوصول.', 'يستخدم الدرس المفصل Java. يشرح مثال اللغة المحددة البرمجة كائنية التوجه فيها.'],
    ur: ['آبجیکٹ اورینٹڈ پروگرامنگ', 'کلاس، آبجیکٹ، تجرید، انکیپسولیشن، کنسٹرکٹر، وراثت، پولیمارفزم اور رسائی کے اصول سیکھیں۔', 'تفصیلی سبق Java استعمال کرتا ہے۔ منتخب زبان کی مثال اسی زبان میں آبجیکٹ اورینٹڈ پروگرامنگ سمجھاتی ہے۔'],
    hi: ['ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग', 'क्लास, ऑब्जेक्ट, एब्स्ट्रैक्शन, एनकैप्सुलेशन, कंस्ट्रक्टर, इनहेरिटेंस, पॉलीमॉर्फ़िज़्म और एक्सेस मॉडिफ़ायर सीखें।', 'विस्तृत पाठ Java का उपयोग करता है। चुनी हुई भाषा का उदाहरण उसी भाषा में ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग समझाता है।'],
    zh: ['面向对象编程', '学习类、对象、抽象、封装、构造函数、继承、多态和访问修饰符。', '详细课程使用 Java。所选语言的示例会说明该语言中的面向对象编程。']
  };
  const notes = {
    c: 'C is procedural and has no built-in class, constructor, inheritance, or access-modifier syntax. A struct groups fields, functions operate on it, and function pointers can provide a simple form of dynamic dispatch. Encapsulation can be designed with opaque types and a public header, but the language does not enforce class-style private/protected members.',
    cpp: 'C++ supports classes, constructors, inheritance, abstract classes, and virtual dispatch. public, private, and protected are member-access levels; class members are private by default, while struct members are public by default. Prefer virtual destructors in polymorphic base classes when objects may be deleted through a base pointer.',
    python: 'Python is object-oriented but uses conventions rather than Java-style access modifiers. A leading underscore marks a non-public name by convention; a double-leading underscore triggers name mangling, not strict privacy. Use abc.ABC and @abstractmethod for abstract interfaces. Methods receive the instance as self.',
    java: 'Java classes use constructors to initialize objects. Abstract classes and interfaces provide abstraction; private fields plus public methods support encapsulation. A subclass extends a class and can override an instance method. Access rules differ: protected also permits access from code in the same package.',
    javascript: 'JavaScript classes support constructors, extends, and method overriding. Public fields and methods are the default; # names create private class elements. JavaScript has no protected access modifier. The language does not declare abstract classes, so a base method can signal that subclasses should implement it.',
    csharp: 'C# supports classes, constructors, abstract classes, inheritance, and virtual/override dispatch. private is the default class-member access; protected is available to derived classes. The example keeps state private and exposes it through a public property.'
  };
  const examples = {
    c: {
      note: notes.c,
      code: `#include <stdio.h>

typedef struct Shape Shape;
typedef int (*AreaFunction)(const Shape *);

struct Shape {
    const char *color;
    int first;
    int second;
    AreaFunction area;
};

static int circleArea(const Shape *shape) {
    return 3 * shape->first * shape->first;
}

static int rectangleArea(const Shape *shape) {
    return shape->first * shape->second;
}

static int getArea(const Shape *shape) {
    return shape->area(shape);
}

int main(void) {
    Shape circle = {"blue", 2, 0, circleArea};
    Shape rectangle = {"red", 3, 4, rectangleArea};
    printf("circle area = %d, color = %s\\n", getArea(&circle), circle.color);
    printf("rectangle area = %d, color = %s\\n", getArea(&rectangle), rectangle.color);
    return 0;
}
`,
      output: 'circle area = 12, color = blue\nrectangle area = 12, color = red\n'
    },
    cpp: {
      note: notes.cpp,
      code: `#include <iostream>
#include <string>
      #include <utility>

class Shape {
private:
    std::string color_;
protected:
    explicit Shape(std::string color) : color_(std::move(color)) {}
public:
    virtual ~Shape() = default;
    const std::string& color() const { return color_; }
    virtual int area() const = 0;
};

class Circle : public Shape {
private:
    int radius_;
public:
    Circle(int radius, std::string color) : Shape(std::move(color)), radius_(radius) {}
    int area() const override { return 3 * radius_ * radius_; }
};

class Rectangle : public Shape {
private:
    int width_;
    int height_;
public:
    Rectangle(int width, int height, std::string color)
        : Shape(std::move(color)), width_(width), height_(height) {}
    int area() const override { return width_ * height_; }
};

int main() {
    Circle circle(2, "blue");
    Rectangle rectangle(3, 4, "red");
    const Shape* shapes[] = {&circle, &rectangle};
    for (const Shape* shape : shapes)
        std::cout << "area = " << shape->area() << ", color = " << shape->color() << "\\n";
}
`,
      output: 'area = 12, color = blue\narea = 12, color = red\n'
    },
    python: {
      note: notes.python,
      code: `from abc import ABC, abstractmethod

class Shape(ABC):
    def __init__(self, color):
        self.__color = color

    @property
    def color(self):
        return self.__color

    @abstractmethod
    def area(self):
        raise NotImplementedError

class Circle(Shape):
    def __init__(self, radius, color):
        super().__init__(color)
        self.__radius = radius

    def area(self):
        return 3 * self.__radius * self.__radius

class Rectangle(Shape):
    def __init__(self, width, height, color):
        super().__init__(color)
        self.__width = width
        self.__height = height

    def area(self):
        return self.__width * self.__height

shapes = [Circle(2, "blue"), Rectangle(3, 4, "red")]
for shape in shapes:
    print(f"area = {shape.area()}, color = {shape.color}")
`,
      output: 'area = 12, color = blue\narea = 12, color = red\n'
    },
    java: {
      note: notes.java,
      code: `abstract class Shape {
    private final String color;

    protected Shape(String color) {
        this.color = color;
    }

    public String getColor() {
        return color;
    }

    public abstract int area();
}

class Circle extends Shape {
    private final int radius;

    public Circle(int radius, String color) {
        super(color);
        this.radius = radius;
    }

    @Override
    public int area() {
        return 3 * radius * radius;
    }
}

class Rectangle extends Shape {
    private final int width;
    private final int height;

    public Rectangle(int width, int height, String color) {
        super(color);
        this.width = width;
        this.height = height;
    }

    @Override
    public int area() {
        return width * height;
    }
}

public class Main {
    public static void main(String[] args) {
        Shape[] shapes = {new Circle(2, "blue"), new Rectangle(3, 4, "red")};
        for (Shape shape : shapes) {
            System.out.println("area = " + shape.area() + ", color = " + shape.getColor());
        }
    }
}
`,
      output: 'area = 12, color = blue\narea = 12, color = red\n'
    },
    javascript: {
      note: notes.javascript,
      code: `class Shape {
    #color;

    constructor(color) {
        this.#color = color;
    }

    get color() {
        return this.#color;
    }

    area() {
        throw new Error("Subclasses must implement area()");
    }
}

class Circle extends Shape {
    #radius;

    constructor(radius, color) {
        super(color);
        this.#radius = radius;
    }

    area() {
        return 3 * this.#radius * this.#radius;
    }
}

class Rectangle extends Shape {
    #width;
    #height;

    constructor(width, height, color) {
        super(color);
        this.#width = width;
        this.#height = height;
    }

    area() {
        return this.#width * this.#height;
    }
}

const shapes = [new Circle(2, "blue"), new Rectangle(3, 4, "red")];
for (const shape of shapes) {
    console.log("area = " + shape.area() + ", color = " + shape.color);
}
`,
      output: 'area = 12, color = blue\narea = 12, color = red\n'
    },
    csharp: {
      note: notes.csharp,
      code: `using System;

abstract class Shape {
    private readonly string color;

    protected Shape(string color) {
        this.color = color;
    }

    public string Color => color;
    public abstract int Area();
}

class Circle : Shape {
    private readonly int radius;

    public Circle(int radius, string color) : base(color) {
        this.radius = radius;
    }

    public override int Area() {
        return 3 * radius * radius;
    }
}

class Rectangle : Shape {
    private readonly int width;
    private readonly int height;

    public Rectangle(int width, int height, string color) : base(color) {
        this.width = width;
        this.height = height;
    }

    public override int Area() {
        return width * height;
    }
}

class Program {
    static void Main() {
        Shape[] shapes = { new Circle(2, "blue"), new Rectangle(3, 4, "red") };
        foreach (Shape shape in shapes) {
            Console.WriteLine("area = " + shape.Area() + ", color = " + shape.Color);
        }
    }
}
`,
      output: 'area = 12, color = blue\narea = 12, color = red\n'
    }
  };
  const questions = [
    { prompt: 'What is a class?', options: ['A blueprint that defines a kind of object', 'A single method call', 'A loop condition', 'A file extension'], answer: 0, explanation: 'A class describes state and behavior from which objects can be created.' },
    { prompt: 'What is an object?', options: ['A comment in source code', 'An instance of a class with its own state', 'An access modifier', 'A constructor declaration'], answer: 1, explanation: 'Creating an object instantiates a class; each object can hold its own field values.' },
    { prompt: 'What does encapsulation aim to do?', options: ['Expose every field for direct changes', 'Bundle state and behavior while controlling access to internal state', 'Make every method static', 'Prevent objects from being constructed'], answer: 1, explanation: 'Encapsulation protects an object’s invariants by controlling how its state is read or changed.' },
    { prompt: 'What happens when a subclass overrides a virtual or abstract method?', options: ['The base class constructor runs again', 'The subclass implementation can be selected at runtime through a base-type reference', 'The object changes its class', 'All private fields become public'], answer: 1, explanation: 'Polymorphic dispatch selects the implementation belonging to the actual object.' },
    { prompt: 'Which access level is intended for implementation details hidden from unrelated callers?', options: ['public', 'private', 'protected', 'global'], answer: 1, explanation: 'Private members are restricted to the declaring class or type, subject to each language’s rules.' }
  ];
  return { locales, notes, examples, questions };
});
