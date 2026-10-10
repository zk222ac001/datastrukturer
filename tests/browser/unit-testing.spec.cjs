const { test, expect } = require('@playwright/test');

test('Unit Testing is entry 13 and explains core test concepts', async ({ page }) => {
  await page.goto('/index.html?lang=en&code=python');
  const card = page.locator('.cards article').filter({ has: page.locator('h2', { hasText: /^Unit Testing$/ }) });
  await expect(card.locator('.number')).toHaveText('13');
  await card.locator('a').click();

  await expect(page.locator('#unit-testing > .topic-no')).toHaveText('13');
  await expect(page).toHaveTitle('Unit Testing · CodeViz');
  for (const id of ['#unit-testing-1', '#unit-testing-2', '#unit-testing-3', '#unit-testing-4', '#unit-testing-5']) {
    await expect(page.locator(id)).toBeVisible();
  }
  await expect(page.locator('#unit-testing-2')).toContainText('Arrange');
  await expect(page.locator('#unit-testing-4')).toContainText('test double');
  await expect(page.locator('#unit-testing-3')).toContainText('Coverage');

  const quiz = page.locator('#unit-testing-quiz');
  const answers = await page.evaluate(() => window.UNIT_TESTING_DATA.questions.map(question => question.answer));
  for (const [index, answer] of answers.entries()) await quiz.locator('fieldset').nth(index).locator('input').nth(answer).check();
  await expect(quiz.locator('.quiz-score')).toContainText('5 / 5');
  await expect(page.locator('#unit-testing-progress')).toContainText('Best: 5/5');
  await page.getByRole('button', { name: 'Mark lesson complete' }).click();
  await expect(page.locator('#unit-testing-progress')).toContainText('Lesson marked complete.');
});

test('Unit Testing examples use selected languages across all interface locales', async ({ page }) => {
  test.setTimeout(120000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const labels = { c: 'C', cpp: 'C++', python: 'Python', java: 'Java', javascript: 'JavaScript', csharp: 'C#' };
  const markers = { c: 'assert(is_even(4))', cpp: 'assert(isEven(4))', python: 'def test_even_number', java: 'throw new AssertionError', javascript: 'node:assert/strict', csharp: 'throw new InvalidOperationException' };

  for (const locale of ['da', 'en', 'es', 'fr', 'de', 'pt', 'ar', 'ur', 'hi', 'zh']) {
    for (const code of Object.keys(labels)) {
      await page.goto(`/index.html?lang=${locale}&code=${code}#unit-testing-example`);
      await expect(page.locator('#unit-testing-example h2')).toContainText(labels[code]);
      await expect(page.locator('.unit-testing-lesson')).toHaveAttribute('lang', 'en');
      await expect(page.locator('.unit-testing-lesson')).toHaveAttribute('dir', 'ltr');
      await expect(page.locator('#unit-testing-example pre code').first()).toContainText(markers[code]);
      await page.evaluate(() => { window.CodeRunner.open = payload => { window.unitTestingPayload = payload; }; });
      await page.locator('[data-unit-testing-run]').click();
      expect(await page.evaluate(() => window.unitTestingPayload.codeLanguage)).toBe(code);
      expect(await page.evaluate(() => window.unitTestingPayload.code)).toContain(markers[code]);
    }
  }
  expect(errors).toEqual([]);
});

test('Unit Testing is reachable from reference pages and section deep links', async ({ page }) => {
  for (const path of ['/formatting.html?lang=en&code=python', '/c-formatting.html?lang=en&code=python']) {
    await page.goto(path);
    const link = page.locator('#sidebar a[href$="#unit-testing"]');
    await expect(link).toContainText('13Unit Testing');
    await link.click();
    await expect(page.locator('#unit-testing > .topic-no')).toHaveText('13');
  }
  await page.goto('/index.html?lang=en&code=python#unit-testing-practice');
  await expect(page.locator('#unit-testing-practice')).toBeVisible();
});
