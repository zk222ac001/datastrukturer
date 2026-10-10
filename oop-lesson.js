'use strict';
(() => {
  const D = window.OOP_DATA, { esc, mountQuiz } = window.CodeVizLearningUI;
  const quiz = new window.CodeVizLearning.Quiz(D.questions);
  const store = window.CodeVizLearning.createProgressStore();
  const lessonId = 'oop-java-en-v1';
  let context;

  function example() {
    const ex = D.examples[context.codeLanguage];
    const p = window.COURSE_DATA.programs[context.codeLanguage];
    return `<section id="oop-example" aria-labelledby="oop-example-title"><h2 id="oop-example-title">Runnable example · ${esc(p.label)}</h2><p>${esc(ex.note)}</p><div class="controls"><button type="button" data-oop-run>Run example</button><button type="button" data-oop-copy>Copy code</button><button type="button" data-oop-download>Download code</button></div><pre tabindex="0" dir="ltr"><code>${esc(ex.code)}</code></pre><h3>Expected output</h3><pre class="output" dir="ltr">${esc(ex.output.trimEnd())}</pre></section>`;
  }

  function tutorial() {
    return `<p class="notice">The detailed explanations and teaching syntax below use Java. See the runnable example above for ${esc(window.COURSE_DATA.programs[context.codeLanguage].label)}. OOP features and access rules vary between languages.</p>
      <nav class="module-outline" aria-label="Object-oriented programming sections">${[['oop-1', 'Classes and objects'], ['oop-2', 'Abstraction'], ['oop-3', 'Encapsulation'], ['oop-4', 'Constructors'], ['oop-5', 'Inheritance'], ['oop-6', 'Polymorphism'], ['oop-7', 'Access modifiers'], ['oop-public', 'Public'], ['oop-private', 'Private'], ['oop-protected', 'Protected']].map(([id, title], i) => `<a class="button" href="#${id}">${i < 7 ? `10.${i + 1} ` : ''}${esc(title)}</a>`).join('')}<a class="button" href="#oop-quiz">Quiz</a><a class="button" href="#oop-practice">Practice</a></nav>
      <section id="oop-1"><h2>10.1 What is a class? What is an object?</h2><p>A <strong>class</strong> is a definition for a kind of object. It describes what data the objects can hold and what operations they can perform. An <strong>object</strong> is one instance created from that class. Each object has its own identity and state.</p><pre dir="ltr"><code>Circle first = new Circle(2, "blue");
Circle second = new Circle(5, "red");</code></pre><p><code>first</code> and <code>second</code> are two objects of the same class. They have different radius and color values, but share the operations defined by <code>Circle</code>. A class is the description; an object is a particular thing made from it.</p></section>
      <section id="oop-2"><h2>10.2 What is abstraction?</h2><p><strong>Abstraction</strong> presents the operations that matter while leaving implementation details behind a clear contract. A caller can ask a shape for its area without needing to know the formula or its internal fields.</p><pre dir="ltr"><code>abstract class Shape {
    public abstract int area();
}</code></pre><p>An abstract class cannot be instantiated directly. Concrete subclasses must implement its abstract operation. Java interfaces are another way to define a contract; choose an interface when unrelated classes should promise the same behavior without sharing a base-class implementation.</p></section>
      <section id="oop-3"><h2>10.3 What is encapsulation?</h2><p><strong>Encapsulation</strong> keeps related state and behavior together and controls how other code can interact with the state. Marking fields <code>private</code> prevents callers from setting arbitrary values. Public methods can validate changes and protect the object’s rules, also called its invariants.</p><pre dir="ltr"><code>class Circle {
    private final int radius;

    public Circle(int radius) {
        if (radius &lt;= 0) throw new IllegalArgumentException();
        this.radius = radius;
    }
}</code></pre><p>Encapsulation does not mean “make every field private and add a setter.” Expose only the operations callers need; keep an object valid throughout its lifetime.</p></section>
      <section id="oop-4"><h2>10.4 What is a constructor?</h2><p>A <strong>constructor</strong> runs when a new object is created. It initializes the object’s starting state. In Java its name matches the class name and it has no return type—not even <code>void</code>.</p><pre dir="ltr"><code>Circle(int radius, String color) {
    super(color);
    this.radius = radius;
}

Circle circle = new Circle(2, "blue");</code></pre><p>The <code>new</code> expression creates the object and calls the constructor. Constructors can accept different parameters, but they are not inherited or overridden like ordinary instance methods.</p></section>
      <section id="oop-5"><h2>10.5 What is inheritance?</h2><p><strong>Inheritance</strong> lets a subclass build on an existing class. In Java, <code>Circle extends Shape</code> means a circle is a kind of shape. It inherits accessible behavior and must provide the implementation required by an abstract parent.</p><pre dir="ltr"><code>class Circle extends Shape {
    @Override
    public int area() {
        return 3 * radius * radius;
    }
}</code></pre><p>A subclass constructor can call a parent constructor with <code>super(...)</code>. Private parent fields remain private; inheritance does not make them directly accessible. Use inheritance for a genuine “is-a” relationship. Prefer composition—one object containing or using another—when the relationship is “has-a.”</p></section>
      <section id="oop-6"><h2>10.6 What is polymorphism?</h2><p><strong>Polymorphism</strong> means one common type or operation can work with objects of different concrete classes. Here, <code>Circle</code> and <code>Rectangle</code> both implement <code>Shape.area()</code>, each with its own calculation.</p><pre dir="ltr"><code>Shape[] shapes = {
    new Circle(2, "blue"),
    new Rectangle(3, 4, "red")
};

for (Shape shape : shapes) {
    System.out.println(shape.area());
}</code></pre><p>Even though the variable <code>shape</code> has the base type, Java selects the overridden method for the actual object at runtime. This lets code use the shared <code>Shape</code> contract without checking every subclass.</p></section>
      <section id="oop-7"><h2>10.7 Access modifiers: public, private and protected</h2><p>An <strong>access modifier</strong> controls which code can use a class, field, constructor, or method. The exact rules are language-specific. In Java, the commonly taught member levels are:</p><div class="table-wrap"><table><caption>Java access levels</caption><thead><tr><th scope="col">Modifier</th><th scope="col">Same class</th><th scope="col">Same package</th><th scope="col">Subclass outside package</th><th scope="col">Unrelated outside code</th></tr></thead><tbody><tr><th scope="row"><code>public</code></th><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td></tr><tr><th scope="row"><code>protected</code></th><td>Yes</td><td>Yes</td><td>Yes, through Java’s subclass access rules</td><td>No</td></tr><tr><th scope="row"><code>private</code></th><td>Yes</td><td>No</td><td>No</td><td>No</td></tr><tr><th scope="row">No modifier</th><td>Yes</td><td>Yes</td><td>No</td><td>No</td></tr></tbody></table></div>
      <section id="oop-public"><h3>Public</h3><p><code>public</code> members form the accessible interface. Other code can use them wherever the declaring type itself is accessible. Keep this interface focused and stable.</p></section>
      <section id="oop-private"><h3>Private</h3><p><code>private</code> members are available only inside the declaring top-level class in Java. Use private fields for implementation details and let carefully chosen methods preserve valid state.</p></section>
      <section id="oop-protected"><h3>Protected</h3><p><code>protected</code> members are accessible within the same Java package and to subclasses, subject to Java’s subclass access rules. This can help designed extension points, but exposing too much to subclasses makes a base class harder to change.</p></section>
      <p>These keywords are not identical across languages. C has no class access modifiers. C++ uses access labels such as <code>public:</code>, <code>private:</code>, and <code>protected:</code>. C# has similar keywords plus additional access combinations. Python relies on naming conventions rather than enforced Java-style access levels; JavaScript uses <code>#name</code> for private class elements and has no built-in <code>protected</code> keyword.</p></section>
      <section id="oop-guidance"><h2>Putting the ideas together</h2><p>In the runnable example, <code>Shape</code> is the abstraction, and a <code>Circle</code> or <code>Rectangle</code> is an object created by a constructor. Each subclass inherits the shape contract and supplies its own area calculation. Private fields protect state, while public methods expose useful behavior. A loop over shapes demonstrates polymorphism.</p><ul><li>Give each class one clear responsibility and use meaningful names.</li><li>Hide internal state; provide methods that express valid actions.</li><li>Use inheritance for substitutable “is-a” types, not just to reuse a few lines.</li><li>Prefer composition when objects collaborate without being the same kind of thing.</li></ul></section>`;
  }

  function progress() {
    const p = store.get(lessonId);
    return `<p role="status">${p.completed ? 'Lesson marked complete.' : 'Lesson not yet marked complete.'} ${p.latest ? `Latest quiz: ${p.latest.score}/${p.latest.total}. Best: ${p.best.score}/${p.best.total}. Attempts: ${p.attempts}.` : 'No completed quiz yet.'} ${store.isPersistent() ? '' : 'Browser storage is unavailable. Progress is kept for this page session only.'}</p><button type="button" data-oop-complete>${p.completed ? 'Mark incomplete' : 'Mark lesson complete'}</button>`;
  }

  function render(c) {
    context = c;
    return `${c.language !== 'en' ? `<p class="notice">${esc(D.locales[c.language][2])}</p>` : ''}<div class="oop-lesson" lang="en" dir="ltr"><p class="eyebrow">Interactive lesson · Java-based OOP concepts</p>${example()}${tutorial()}<section id="oop-quiz" aria-label="Object-oriented programming quiz"></section><section id="oop-practice"><h2>Practice</h2><p>Add a <code>Triangle extends Shape</code> class that stores a base and height. Override <code>area()</code> and test it in a <code>Shape[]</code> with the other objects. Check that the loop calls the right implementation for every object.</p><details><summary>Hint</summary><p>For this integer example, return <code>base * height / 2</code> from Triangle’s <code>area()</code>. Keep its dimensions private and initialize them in its constructor.</p></details></section>    <section aria-label="Object-oriented programming progress"><h2>Your progress</h2><p>Quiz results and your completion marker stay in this browser. No registration or personal information is needed.</p><div id="oop-progress">${progress()}</div></section><p class="small">Further reading: <a href="https://docs.oracle.com/javase/tutorial/java/concepts/" target="_blank" rel="noopener">Oracle Java Tutorials: Object-Oriented Programming Concepts</a>, <a href="https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html" target="_blank" rel="noopener">Constructors</a>, <a href="https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html" target="_blank" rel="noopener">Controlling Access to Members of a Class</a>.</p><p id="oop-code-status" role="status"></p></div>`;
  }

  function mount() {
    const root = document.querySelector('.oop-lesson');
    if (!root) return;
    mountQuiz(root.querySelector('#oop-quiz'), {
      quiz,
      id: lessonId,
      onComplete: result => {
        store.recordQuiz(lessonId, result);
        root.querySelector('#oop-progress').innerHTML = progress();
      }
    });
    root.addEventListener('click', async event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.hasAttribute('data-oop-complete')) {
        store.complete(lessonId, !store.get(lessonId).completed);
        root.querySelector('#oop-progress').innerHTML = progress();
        root.querySelector('[data-oop-complete]').focus();
        return;
      }
      if (!button.matches('[data-oop-run], [data-oop-copy], [data-oop-download]')) return;
      const ex = D.examples[context.codeLanguage], p = window.COURSE_DATA.programs[context.codeLanguage];
      const code = ex.code, filename = p.filename || `oop-example.${p.ext}`;
      if (button.hasAttribute('data-oop-run')) {
        window.CodeRunner.open({ language: context.language, codeLanguage: context.codeLanguage, code, filename, label: p.label + ' · Object-Oriented Programming' });
      } else if (button.hasAttribute('data-oop-copy')) {
        try {
          await navigator.clipboard.writeText(code);
          root.querySelector('#oop-code-status').textContent = window.COURSE_DATA.translations[context.language].ui.copied;
        } catch {
          root.querySelector('#oop-code-status').textContent = window.COURSE_DATA.translations[context.language].ui.copyFailed;
        }
      } else {
        const url = URL.createObjectURL(new Blob([code], { type: 'text/plain;charset=utf-8' }));
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    });
  }

  window.OOPLesson = { render, mount };
})();
