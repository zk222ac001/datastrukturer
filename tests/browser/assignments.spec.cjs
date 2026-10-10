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

test('data structure lessons include editable, runnable assignments', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/datastrukturer.html?lang=en&code=python');
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
  const runButton = assignment.getByRole('button');
  await expect(runButton).toBeVisible();
  await runButton.focus();
  await expect(runButton).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
