const { test, expect } = require('@playwright/test');

test('Pointers is entry 09 and covers all requested C topics', async ({ page }) => {
  await page.goto('/index.html?lang=en&code=c');
  const card = page.locator('.cards article').filter({ has: page.locator('h2', { hasText: /^Pointers$/ }) });
  await expect(card.locator('.number')).toHaveText('09');
  await card.locator('a').click();

  await expect(page.locator('#pointers > .topic-no')).toHaveText('09');
  await expect(page).toHaveTitle('Pointers · CodeViz');
  for (const id of ['#pointers-1', '#pointers-2', '#pointers-3', '#pointers-4', '#pointers-5']) {
    await expect(page.locator(id)).toBeVisible();
  }

  const simulation = page.locator('#pointers-simulator');
  await simulation.locator('#pointers-scenario').selectOption('allocation');
  await simulation.locator('#pointers-failure').check();
  for (let i = 0; i < 3; i++) await simulation.locator('[data-pointers-step=next]').click();
  await expect(simulation.locator('#pointers-step-status')).toContainText('failure');
  await expect(simulation.locator('.output')).toHaveText('Allocation failed');

  const quiz = page.locator('#pointers-quiz');
  const answers = await page.evaluate(() => window.POINTERS_DATA.questions.map(question => question.answer));
  for (const [index, answer] of answers.entries()) await quiz.locator('fieldset').nth(index).locator('input').nth(answer).check();
  await expect(quiz.locator('.quiz-score')).toContainText('5 / 5');
  await page.getByRole('button', { name: 'Mark lesson complete' }).click();
  await expect(page.locator('#pointers-progress')).toContainText('Lesson marked complete.');
});

test('Pointers is discoverable from both formatting reference pages', async ({ page }) => {
  for (const path of ['/formatting.html?lang=en&code=c', '/c-formatting.html?lang=en&code=c']) {
    await page.goto(path);
    const link = page.locator('#sidebar a[href$="#pointers"]');
    await expect(link).toContainText('09Pointers');
    await link.click();
    await expect(page.locator('#pointers > .topic-no')).toHaveText('09');
  }
});

test('Pointers examples use the selected programming language in every interface locale', async ({ page }) => {
  test.setTimeout(120000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const locales = ['da', 'en', 'es', 'fr', 'de', 'pt', 'ar', 'ur', 'hi', 'zh'];
  const languages = ['c', 'cpp', 'python', 'java', 'javascript', 'csharp'];

  for (const locale of locales) {
    for (const code of languages) {
      await page.goto(`/index.html?lang=${locale}&code=${code}#pointers`);
      await expect(page.locator('#pointers-example')).toContainText(
        { c: 'C', cpp: 'C++', python: 'Python', java: 'Java', javascript: 'JavaScript', csharp: 'C#' }[code]
      );
      await expect(page.locator('.pointers-lesson')).toHaveAttribute('lang', 'en');
      await expect(page.locator('.pointers-lesson')).toHaveAttribute('dir', 'ltr');
      await expect(page.locator('#pointers-1')).toHaveCount(code === 'c' ? 1 : 0);

      await page.evaluate(() => {
        window.CodeRunner.open = payload => { window.pointersPayload = payload; };
      });
      await page.locator('#pointers-example [data-pointers-run=native]').click();
      expect(await page.evaluate(() => window.pointersPayload.codeLanguage)).toBe(code);
      expect(await page.evaluate(() => window.pointersPayload.code)).toContain(
        { c: 'malloc', cpp: 'std::vector', python: 'def change', java: 'ArrayList', javascript: 'function change', csharp: 'ref int' }[code]
      );
    }
  }
  expect(errors).toEqual([]);
});
