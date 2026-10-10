const { test, expect } = require('@playwright/test');
const locales = ['da', 'en', 'es', 'fr', 'de', 'pt', 'ar', 'ur', 'hi', 'zh'];
const languages = ['c', 'cpp', 'python', 'java', 'javascript', 'csharp'];
test('trace navigation, zero iterations, descending steps, reset and editor payload', async ({ page }) => {
  await page.goto('/index.html?lang=en&code=c#counter');
  await expect(page.locator('.for-anatomy')).toContainText('\\n');
  const lesson = page.locator('.for-lesson');
  const status = page.locator('#for-step-status');
  await expect(status).toContainText('Ready');
  await expect(lesson.getByRole('button', { name: 'Previous', exact: true })).toBeDisabled();
  await lesson.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('.executing')).toHaveText('int i = 1');
  await lesson.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('.executing')).toHaveText('i <= 5');
  await lesson.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('#for-trace .output')).toHaveText('1');
  await lesson.getByRole('button', { name: 'Previous', exact: true }).click();
  await expect(page.locator('#for-trace .output')).toHaveText('(no output)');
  await lesson.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(status).toContainText('Ready');
  await page.locator('[name=start]').fill('5'); await page.locator('[name=end]').fill('1');
  await lesson.getByRole('button', { name: 'Apply and reset' }).click();
  for (let i = 0; i < 3; i++) await lesson.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(status).toContainText('terminate');
  await expect(page.locator('#for-trace .output')).toHaveText('(no output)');
  await expect(lesson.getByRole('button', { name: 'Next', exact: true })).toBeDisabled();
  await page.locator('[name=start]').fill('3'); await page.locator('[name=step]').fill('-1');
  await lesson.getByRole('button', { name: 'Apply and reset' }).click();
  for (let i = 0; i < 12; i++) await lesson.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(status).toContainText('terminate');
  await expect(page.locator('#for-trace .output')).toHaveText('3\n2\n1');
  await page.locator('[name=step]').fill('0');
  await lesson.getByRole('button', { name: 'Apply and reset' }).click();
  await expect(page.locator('#for-config-error')).toContainText('nonzero');
  await page.evaluate(() => { window.CodeRunner.open = payload => { window.testPayload = payload; }; });
  await lesson.getByRole('button', { name: 'Run this C example in editor' }).click();
  expect(await page.evaluate(() => window.testPayload)).toMatchObject({ codeLanguage: 'c', filename: 'for-loop.c' });
  expect(await page.evaluate(() => window.testPayload.code)).toContain('i >= 1; i += -1');
  await lesson.getByRole('button', { name: 'Open C starter in editor' }).first().click();
  expect(await page.evaluate(() => window.testPayload.code)).toContain('TODO');
  await lesson.getByRole('link', { name: 'Quiz', exact: true }).click();
  await expect(page.locator('.for-lesson')).toBeVisible();
  expect(await page.evaluate(() => window.courseState().module)).toBe(3);
});
test('quiz instant feedback, retry, saved progress and clearing storage', async ({ page }) => {
  await page.goto('/index.html?lang=en&code=c#counter');
  const quiz = page.locator('#for-quiz');
  const choices = [0, 1, 0, 2, 2];
  for (let i = 0; i < choices.length; i++) {
    await quiz.locator('fieldset').nth(i).locator('input').nth(choices[i]).check();
    await expect(quiz.locator('fieldset').nth(i)).toContainText('Correct.');
  }
  await expect(quiz.locator('.quiz-score')).toContainText('5 / 5');
  await page.getByRole('button', { name: 'Mark lesson complete', exact: true }).click();
  await page.reload();
  await expect(page.locator('#for-progress')).toContainText('Best: 5/5');
  await expect(page.locator('#for-progress')).toContainText('Lesson marked complete.');
  for (let i = 0; i < choices.length; i++) await quiz.locator('fieldset').nth(i).locator('input').nth((choices[i] + 1) % 4).check();
  await expect(quiz.locator('.quiz-score')).toContainText('0 / 5');
  await quiz.getByRole('button', { name: 'Retry quiz' }).click();
  await expect(quiz.locator('.quiz-score')).toContainText('0 / 5 answered');
  await expect(page.locator('#for-progress')).toContainText('Latest quiz: 0/5. Best: 5/5. Attempts: 2');
  await page.evaluate(() => localStorage.clear()); await page.reload();
  await expect(page.locator('#for-progress')).toContainText('No completed quiz yet');
});
test('unavailable storage keeps progress for session and lesson switching is language-safe', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }));
  await page.goto('/index.html?lang=ar&code=c#counter');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('.for-lesson')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.for-lesson')).toHaveAttribute('dir', 'ltr');
  await page.getByRole('button', { name: 'Mark lesson complete', exact: true }).click();
  await expect(page.locator('#for-progress')).toContainText('page session only');
  await page.locator('#program-language').selectOption('python');
  await expect(page.locator('.for-lesson')).toHaveCount(0);
  await expect(page.locator('#counter .notice')).toBeVisible();
  await expect(page.locator('#counter pre').first()).not.toContainText('printf');
  await page.locator('#program-language').selectOption('c');
  await expect(page.locator('#for-progress')).toContainText('Lesson marked complete');
});
test('mobile lesson has no page overflow and all code stays left-to-right', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.html?lang=ur&code=c#counter');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator('.for-lesson pre').evaluateAll(nodes => nodes.every(n => getComputedStyle(n).direction === 'ltr'))).toBe(true);
});
// Exercise every old course view and formatting demonstration in all selector combinations.
for (const locale of locales) test(`existing views and reference regressions: ${locale}`, async ({ page }) => {
  test.setTimeout(120000);
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  for (const language of languages) {
    await page.goto(`/index.html?lang=${locale}&code=${language}#intro`);
    await expect(page.locator('html')).toHaveAttribute('dir', ['ar', 'ur'].includes(locale) ? 'rtl' : 'ltr');
    for (const hash of ['intro', 'data', 'control', 'module-loops']) {
      await page.evaluate(hash => { location.hash = hash; }, hash);
      await expect(page.locator('.lab')).toBeVisible();
      await expect(page.locator('#codeView')).not.toBeEmpty();
      await expect(page.locator('#program-language')).toHaveValue(language);
      await expect(page.locator('#language')).toHaveValue(locale);
    }
    await expect(page.locator('.for-lesson')).toHaveCount(language === 'c' ? 1 : 0);
    if (locale !== 'en' || language !== 'c') await expect(page.locator('#counter .notice')).toBeVisible();
    await page.goto(`/formatting.html?lang=${locale}&code=${language}`);
    for (let i = 0; i < 12; i++) {
      await page.locator('#demoSelect').selectOption(String(i));
      await page.locator('[data-action=reveal]').click();
      await expect(page.locator('#demoOutput pre')).not.toBeEmpty();
    }
  }
  expect(errors).toEqual([]);
});
test('legacy URL, original simulations, downloads and OneCompiler lazy loading', async ({ page }) => {
  await page.goto('/c-formatting.html?lang=en&code=java');
  await expect(page.locator('#program-language')).toHaveValue('java');
  await page.goto('/index.html?lang=en&code=c#intro');
  await page.locator('[data-concept=hardware-next]').click();
  await expect(page.locator('.hardware-node.selected')).toContainText('a = 7');
  await page.locator('[data-concept=train]').click();
  await expect(page.locator('.prediction')).not.toContainText('—');
  await page.locator('#root-value').evaluate(el => { el.value = '64'; el.dispatchEvent(new Event('change', { bubbles: true })); });
  await expect(page.locator('.function-route')).toContainText('8');
  await page.locator('#sensor-temp').evaluate(el => { el.value = '30'; el.dispatchEvent(new Event('change', { bubbles: true })); });
  await expect(page.locator('.fan-card')).toHaveClass(/is-on/);
  await page.locator('#data-devices').fill('1'); await page.locator('#data-devices').dispatchEvent('change');
  await expect(page.locator('.data-metrics')).toContainText('86,400');
  await expect(page.locator('iframe')).toHaveCount(0);
  const download = page.waitForEvent('download');
  await page.locator('[data-download=current]').click();
  expect((await download).suggestedFilename()).toBe('hello.c');
  // Intercept the provider to test integration without depending on external availability.
  await page.route('https://onecompiler.com/**', route => route.fulfill({ contentType: 'text/html', body: '<html><body>Editor test</body></html>' }));
  await page.locator('[data-run=current]').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('iframe')).toHaveAttribute('src', /onecompiler.com\/embed\/c\?/);
  await page.locator('[data-runner-close]').click();
  await expect(page.locator('iframe')).toHaveCount(0);
});
