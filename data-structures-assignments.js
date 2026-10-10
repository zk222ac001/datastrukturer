'use strict';
(() => {
  const chapters = [
    {
      title: 'Array',
      task: 'Modify the example to insert 5 at the front, then calculate and print the sum of every value in the updated array.',
      expected: 'The output includes the updated array and its correct sum.'
    },
    {
      title: 'Linked List',
      task: 'Add a node with value 40 after the head, then traverse the list from head to the end.',
      expected: '10\n40\n20\n30'
    },
    {
      title: 'Stack',
      task: 'Push 40 and then 50. Pop twice and print the removed values in order.',
      expected: '50\n40'
    },
    {
      title: 'Queue',
      task: 'Enqueue 40, dequeue once, then print the removed value and the remaining queue.',
      expected: 'Removed: 10\nRemaining: 20, 30, 40'
    },
    {
      title: 'Tree',
      task: 'Add a new child named exercise.py beneath Python and print every node in preorder.',
      expected: 'The root appears first, followed by Python and its children, then the remaining root branches.'
    },
    {
      title: 'Graph',
      task: 'Run breadth-first search from A. Track visited nodes so a cycle never causes a repeated visit, and print the shortest route to E.',
      expected: 'Each reachable node is printed once; a shortest route from A to E uses two edges.'
    },
    {
      title: 'Hash Table',
      task: 'Store both Bo and Ada with different values, even though the teaching hash function places them in the same bucket. Look up both keys.',
      expected: 'Both original values are returned; adding the second key does not overwrite the first.'
    }
  ];

  function enhance() {
    const content = document.getElementById('content');
    const lower = content?.querySelector('.lower');
    const active = document.querySelector('#nav button[aria-current="page"]');
    if (!content || !lower || !active) return;
    const index = [...document.querySelectorAll('#nav button')].indexOf(active);
    const chapter = chapters[index];
    if (!chapter) return;
    const existing = content.querySelector('[data-structure-assignment]');
    if (existing?.dataset.structureAssignment === String(index)) return;
    existing?.remove();
    const panel = document.createElement('section');
    panel.className = 'card assignment-card';
    panel.dataset.structureAssignment = String(index);
    panel.lang = 'en';
    panel.dir = 'ltr';
    panel.innerHTML = `<p class="eyebrow">Coding assignment · ${chapter.title}</p><h2>Task</h2><p>${chapter.task}</p><h3>Expected outcome</h3><pre class="code">${chapter.expected}</pre><button type="button" class="primary" data-structure-assignment-run="${index}">Open example in online editor →</button><p class="muted">Edit the example, run it in OneCompiler, and compare the result with this check. Instructions are in English.</p>`;
    lower.insertAdjacentElement('afterend', panel);
  }

  const content = document.getElementById('content');
  if (!content) throw new Error('Data structures lesson content is missing.');
  new MutationObserver(enhance).observe(content, { childList: true, subtree: true });
  enhance();
  content.addEventListener('click', event => {
    const button = event.target.closest('[data-structure-assignment-run]');
    if (!button) return;
    const chapter = chapters[Number(button.dataset.structureAssignmentRun)];
    const codeLanguage = document.getElementById('code-language')?.value;
    const language = document.getElementById('language')?.value;
    const example = content.querySelector('.lower .card:nth-child(2) code')?.textContent;
    const program = window.COURSE_DATA.programs[codeLanguage];
    if (!chapter || !program || !example) throw new Error('Could not prepare the data structures assignment.');
    window.CodeRunner.open({
      language,
      codeLanguage,
      filename: program.filename || `structures-assignment.${program.ext}`,
      code: example,
      label: 'Assignment · ' + chapter.title
    });
  });
})();
