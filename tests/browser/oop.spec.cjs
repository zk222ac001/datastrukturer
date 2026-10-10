const { test, expect } = require('@playwright/test');

test('Object-oriented programming is entry 10 and explains each requested concept', async ({ page }) => {
  await page.goto('/index.html?lang=en&code=java');
  const card = page.locator('.cards article').filter({ has: page.locator('h2', { hasText: /^Object-Oriented Programming$/ }) });
  await expect(card.locator('.number')).toHaveText('10');
  await card.locator('a').click();

  await expect(page.locator('#oop > .topic-no')).toHaveText('10');
  await expect(page).toHaveTitle('Object-Oriented Programming · CodeViz');
  for (const id of ['#oop-1', '#oop-2', '#oop-3', '#oop-4', '#oop-5', '#oop-6', '#oop-7']) {
    await expect(page.locator(id)).toBeVisible();
  }
  for (const id of ['#oop-public', '#oop-private', '#oop-protected']) await expect(page.locator(id)).toBeVisible();
  await expect(page.locator('#oop-7 table tbody tr')).toHaveCount(4);
  await expect(page.locator('#oop-example')).toContainText('abstract class Shape');

  const quiz = page.locator('#oop-quiz');
  const answers = await page.evaluate(() => window.OOP_DATA.questions.map(question => question.answer));
  for (const [index, answer] of answers.entries()) await quiz.locator('fieldset').nth(index).locator('input').nth(answer).check();
  await expect(quiz.locator('.quiz-score')).toContainText('5 / 5');
  await expect(page.locator('#oop-progress')).toContainText('Best: 5/5');
  await page.getByRole('button', { name: 'Mark lesson complete' }).click();
  await expect(page.locator('#oop-progress')).toContainText('Lesson marked complete.');
});

test('Object-oriented programming examples use all six language tracks across interface locales', async ({ page }) => {
  test.setTimeout(120000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const localeCode = { c: 'C', cpp: 'C++', python: 'Python', java: 'Java', javascript: 'JavaScript', csharp: 'C#' };
  const exampleMarkers = { c: 'typedef struct Shape', cpp: 'class Shape', python: 'class Shape(ABC)', java: 'abstract class Shape', javascript: 'class Shape', csharp: 'abstract class Shape' };

  for (const locale of ['da', 'en', 'es', 'fr', 'de', 'pt', 'ar', 'ur', 'hi', 'zh']) {
    for (const code of Object.keys(localeCode)) {
      await page.goto(`/index.html?lang=${locale}&code=${code}#oop-example`);
      await expect(page.locator('#oop-example h2')).toContainText(localeCode[code]);
      await expect(page.locator('.oop-lesson')).toHaveAttribute('lang', 'en');
      await expect(page.locator('.oop-lesson')).toHaveAttribute('dir', 'ltr');
      await expect(page.locator('#oop-example pre code').first()).toContainText(exampleMarkers[code]);
      await page.evaluate(() => { window.CodeRunner.open = payload => { window.oopPayload = payload; }; });
      await page.locator('[data-oop-run]').click();
      expect(await page.evaluate(() => window.oopPayload.codeLanguage)).toBe(code);
      expect(await page.evaluate(() => window.oopPayload.code)).toContain(exampleMarkers[code]);
    }
  }
  expect(errors).toEqual([]);
});

test('Object-oriented programming entry remains reachable from reference pages and fits mobile RTL', async ({ page }) => {
  for (const path of ['/formatting.html?lang=en&code=java', '/c-formatting.html?lang=en&code=java']) {
    await page.goto(path);
    const link = page.locator('#sidebar a[href$="#oop"]');
    await expect(link).toContainText('10Object-Oriented Programming');
    await link.click();
    await expect(page.locator('#oop > .topic-no')).toHaveText('10');
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.html?lang=ur&code=javascript#oop');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
