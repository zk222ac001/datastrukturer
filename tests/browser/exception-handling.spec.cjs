const { test, expect } = require('@playwright/test');

test('Exception Handling is entry 12 and teaches exception flow and recovery', async ({ page }) => {
  await page.goto('/index.html?lang=en&code=python');
  const card = page.locator('.cards article').filter({ has: page.locator('h2', { hasText: /^Exception Handling$/ }) });
  await expect(card.locator('.number')).toHaveText('12');
  await card.locator('a').click();

  await expect(page.locator('#exception-handling > .topic-no')).toHaveText('12');
  await expect(page).toHaveTitle('Exception Handling · CodeViz');
  for (const id of ['#exception-handling-1', '#exception-handling-2', '#exception-handling-3', '#exception-handling-4']) {
    await expect(page.locator(id)).toBeVisible();
  }
  await expect(page.locator('#exception-handling-2')).toContainText('propagates');
  await expect(page.locator('#exception-handling-3')).toContainText('Catch the narrowest type');
  await expect(page.locator('#exception-handling-4')).toContainText('C has no built-in');

  const quiz = page.locator('#exception-handling-quiz');
  const answers = await page.evaluate(() => window.EXCEPTION_HANDLING_DATA.questions.map(question => question.answer));
  for (const [index, answer] of answers.entries()) await quiz.locator('fieldset').nth(index).locator('input').nth(answer).check();
  await expect(quiz.locator('.quiz-score')).toContainText('5 / 5');
  await expect(page.locator('#exception-handling-progress')).toContainText('Best: 5/5');
  await page.getByRole('button', { name: 'Mark lesson complete' }).click();
  await expect(page.locator('#exception-handling-progress')).toContainText('Lesson marked complete.');
});

test('Exception Handling examples work for all six language selections and ten locales', async ({ page }) => {
  test.setTimeout(120000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const labels = { c: 'C', cpp: 'C++', python: 'Python', java: 'Java', javascript: 'JavaScript', csharp: 'C#' };
  const markers = { c: 'is_positive', cpp: 'throw std::invalid_argument', python: 'raise ValueError', java: 'throw new IllegalArgumentException', javascript: 'throw new Error', csharp: 'throw new ArgumentOutOfRangeException' };

  for (const locale of ['da', 'en', 'es', 'fr', 'de', 'pt', 'ar', 'ur', 'hi', 'zh']) {
    for (const code of Object.keys(labels)) {
      await page.goto(`/index.html?lang=${locale}&code=${code}#exception-handling-example`);
      await expect(page.locator('#exception-handling-example h2')).toContainText(labels[code]);
      await expect(page.locator('.exception-handling-lesson')).toHaveAttribute('lang', 'en');
      await expect(page.locator('.exception-handling-lesson')).toHaveAttribute('dir', 'ltr');
      await expect(page.locator('#exception-handling-example pre code').first()).toContainText(markers[code]);
      await page.evaluate(() => { window.CodeRunner.open = payload => { window.exceptionHandlingPayload = payload; }; });
      await page.locator('[data-exception-handling-run]').click();
      expect(await page.evaluate(() => window.exceptionHandlingPayload.codeLanguage)).toBe(code);
      expect(await page.evaluate(() => window.exceptionHandlingPayload.code)).toContain(markers[code]);
    }
  }
  expect(errors).toEqual([]);
});

test('Exception Handling is reachable from reference pages and section deep links', async ({ page }) => {
  for (const path of ['/formatting.html?lang=en&code=python', '/c-formatting.html?lang=en&code=python']) {
    await page.goto(path);
    const link = page.locator('#sidebar a[href$="#exception-handling"]');
    await expect(link).toContainText('12Exception Handling');
    await link.click();
    await expect(page.locator('#exception-handling > .topic-no')).toHaveText('12');
  }
  await page.goto('/index.html?lang=en&code=python#exception-handling-practice');
  await expect(page.locator('#exception-handling-practice')).toBeVisible();
});
