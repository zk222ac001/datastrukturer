const { test, expect } = require('@playwright/test');

test('every course lesson and detailed topic renders its coding assignment', async ({ page }) => {
  const lessons = [
    ['intro', 'python', 8],
    ['data', 'python', 7],
    ['control', 'python', 9],
    ['module-loops', 'python', 6],
    ['arrays', 'c', 4],
    ['switch', 'python', 9],
    ['functions', 'python', 9],
    ['pointers', 'c', 8],
    ['oop', 'python', 13],
    ['file-handling', 'python', 7],
    ['exception-handling', 'python', 6],
    ['unit-testing', 'python', 7]
  ];

  for (const [lesson, code, count] of lessons) {
    await page.goto(`/index.html?lang=en&code=${code}&refresh=1#${lesson}`);
    await expect(page.locator('.topic-assignment')).toHaveCount(count);
    const assignmentIds = await page.evaluate(() => {
      const root = document.querySelector('main');
      return [...document.querySelectorAll('[data-topic-assignment]')].map(panel => panel.dataset.topicAssignment)
        .filter(id => root.contains(document.getElementById(id)));
    });
    expect(new Set(assignmentIds).size).toBe(count);
  }
});

test('assignment starters open in the selected language with supplied input and expected outcomes', async ({ page }) => {
  const extensions = { c: '.c', cpp: '.cpp', python: '.py', java: '.java', javascript: '.js', csharp: '.cs' };
  for (const code of Object.keys(extensions)) {
    await page.goto(`/index.html?lang=en&code=${code}#io`);
    const assignment = page.locator('[data-topic-assignment="io"]');
    await expect(assignment).toContainText('Expected outcome');
    await expect(assignment).toContainText('Double: 10');
    await page.evaluate(() => { window.CodeRunner.open = payload => { window.assignmentPayload = payload; }; });
    await assignment.locator('[data-assignment-run="io"]').click();
    const payload = await page.evaluate(() => window.assignmentPayload);
    expect(payload.codeLanguage).toBe(code);
    expect(payload.filename.endsWith(extensions[code])).toBe(true);
    expect(payload.code).toContain('TODO: implement the assignment');
    expect(payload.stdin).toBe('5\n');
  }
});

test('solution controls reveal complete code in the selected programming language', async ({ page }) => {
  for (const code of ['c', 'cpp', 'python', 'java', 'javascript', 'csharp']) {
    await page.goto(`/index.html?lang=en&code=${code}#hello`);
    const assignment = page.locator('[data-topic-assignment="hello"]');
    const solutionButton = assignment.locator('[data-assignment-solution="hello"]');
    const solution = assignment.locator('#assignment-solution-hello');
    await expect(solutionButton).toHaveAttribute('aria-expanded', 'false');
    await solutionButton.click();
    await expect(solutionButton).toHaveAttribute('aria-expanded', 'true');
    await expect(solution).toBeVisible();
    const displayedCode = await solution.locator('code').textContent();
    const expectedCode = await page.evaluate(() => window.LANGUAGE_EXAMPLES[window.location.search.match(/code=([^&]+)/)[1]].hello.code);
    expect(displayedCode.trimEnd()).toBe(expectedCode.trimEnd());
    await solutionButton.click();
    await expect(solution).toBeHidden();

    await page.goto(`/index.html?lang=en&code=${code}#intro`);
    const formattingAssignment = page.locator('[data-topic-assignment="formatting"]');
    await formattingAssignment.locator('[data-assignment-solution="formatting"]').click();
    const formattingCode = await formattingAssignment.locator('#assignment-solution-formatting code').textContent();
    expect(formattingCode).toContain('12.5');
    expect(formattingCode).toContain('Price:');
  }
});

test('data structure lessons include editable, runnable assignments', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/datastrukturer.html?lang=en&code=python', { waitUntil: 'domcontentloaded' });
  const assignment = page.locator('[data-structure-assignment]');
  await expect(assignment).toHaveCount(1);
  await page.evaluate(() => { window.CodeRunner.open = payload => { window.structureAssignmentPayload = payload; }; });

  for (let index = 0; index < 7; index++) {
    await page.locator('#nav button').nth(index).click();
    await expect(page.locator(`[data-structure-assignment="${index}"]`)).toBeVisible();
    await expect(page.locator('[data-structure-assignment]')).toContainText('Expected outcome');
  }

  await page.locator('[data-structure-assignment-run="6"]').click();
  const payload = await page.evaluate(() => window.structureAssignmentPayload);
  expect(payload.codeLanguage).toBe('python');
  expect(payload.code).toContain('student');
  expect(payload.label).toContain('Hash Table');
  const solutionButton = page.locator('[data-structure-assignment-solution="6"]');
  await solutionButton.click();
  await expect(page.locator('#structure-solution-6')).toBeVisible();
  expect(await page.locator('[data-structure-solution-code]').textContent()).toBe(payload.code);
  expect(await page.locator('#nav button').count()).toBe(9);
  for (let index = 7; index < 9; index++) {
    await page.locator('#nav button').nth(index).click();
    await expect(page.locator('[data-structure-assignment]')).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test('assignment cards remain accessible and fit a narrow RTL lesson viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.html?lang=ur&code=c#pointers');
  const assignment = page.locator('[data-topic-assignment="pointers-1"]');
  await expect(assignment).toHaveAttribute('lang', 'en');
  await expect(assignment).toHaveAttribute('dir', 'ltr');
  const runButton = assignment.locator('[data-assignment-run="pointers-1"]');
  await expect(runButton).toBeVisible();
  await runButton.focus();
  await expect(runButton).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
