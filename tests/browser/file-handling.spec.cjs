const { test, expect } = require('@playwright/test');

test('File Handling is entry 11 and teaches writing, reading, and OOP file operations', async ({ page }) => {
  await page.goto('/index.html?lang=en&code=python');
  const card = page.locator('.cards article').filter({ has: page.locator('h2', { hasText: /^File Handling$/ }) });
  await expect(card.locator('.number')).toHaveText('11');
  await card.locator('a').click();

  await expect(page.locator('#file-handling > .topic-no')).toHaveText('11');
  await expect(page).toHaveTitle('File Handling · CodeViz');
  for (const id of ['#file-handling-1', '#file-handling-2', '#file-handling-3', '#file-handling-4', '#file-handling-safety']) {
    await expect(page.locator(id)).toBeVisible();
  }
  await expect(page.locator('#file-handling-2')).toContainText('write or append mode');
  await expect(page.locator('#file-handling-3')).toContainText('read mode');
  await expect(page.locator('#file-handling-4')).toContainText('encapsulation');

  const quiz = page.locator('#file-handling-quiz');
  const answers = await page.evaluate(() => window.FILE_HANDLING_DATA.questions.map(question => question.answer));
  for (const [index, answer] of answers.entries()) await quiz.locator('fieldset').nth(index).locator('input').nth(answer).check();
  await expect(quiz.locator('.quiz-score')).toContainText('5 / 5');
  await expect(page.locator('#file-handling-progress')).toContainText('Best: 5/5');
  await page.getByRole('button', { name: 'Mark lesson complete' }).click();
  await expect(page.locator('#file-handling-progress')).toContainText('Lesson marked complete.');
});

test('File Handling examples stay aligned with all locale and programming-language selections', async ({ page }) => {
  test.setTimeout(120000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const labels = { c: 'C', cpp: 'C++', python: 'Python', java: 'Java', javascript: 'JavaScript', csharp: 'C#' };
  const markers = { c: 'fopen', cpp: 'class NoteFile', python: 'class NoteFile', java: 'class NoteFile', javascript: 'class NoteFile', csharp: 'class NoteFile' };

  for (const locale of ['da', 'en', 'es', 'fr', 'de', 'pt', 'ar', 'ur', 'hi', 'zh']) {
    for (const code of Object.keys(labels)) {
      await page.goto(`/index.html?lang=${locale}&code=${code}#file-handling-example`);
      await expect(page.locator('#file-handling-example h2')).toContainText(labels[code]);
      await expect(page.locator('.file-handling-lesson')).toHaveAttribute('lang', 'en');
      await expect(page.locator('.file-handling-lesson')).toHaveAttribute('dir', 'ltr');
      await expect(page.locator('#file-handling-example pre code').first()).toContainText(markers[code]);
      await page.evaluate(() => { window.CodeRunner.open = payload => { window.fileHandlingPayload = payload; }; });
      await page.locator('[data-file-handling-run]').click();
      expect(await page.evaluate(() => window.fileHandlingPayload.codeLanguage)).toBe(code);
      expect(await page.evaluate(() => window.fileHandlingPayload.code)).toContain(markers[code]);
    }
  }
  expect(errors).toEqual([]);
});

test('File Handling appears in reference navigation and its deep links resolve', async ({ page }) => {
  for (const path of ['/formatting.html?lang=en&code=python', '/c-formatting.html?lang=en&code=python']) {
    await page.goto(path);
    const link = page.locator('#sidebar a[href$="#file-handling"]');
    await expect(link).toContainText('11File Handling');
    await link.click();
    await expect(page.locator('#file-handling > .topic-no')).toHaveText('11');
  }
  await page.goto('/index.html?lang=en&code=python#file-handling-practice');
  await expect(page.locator('#file-handling-practice')).toBeVisible();
});
