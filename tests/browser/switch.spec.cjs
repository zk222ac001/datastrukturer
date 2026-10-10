const { test, expect } = require('@playwright/test');
test('switch is listed under control and traces matching, breaks, defaults and fall-through', async ({ page }) => {
  await page.goto('/index.html?lang=en&code=c');
  await page.locator('.cards a[href$="#switch"]').click();
  await expect(page.locator('#switch .topic-no')).toHaveText('3.8');
  await expect(page.locator('#assignment .topic-no')).toHaveText('3.9');
  const sim = page.locator('#switch-simulator');
  await sim.locator('#switch-choice').selectOption('1'); await sim.locator('#switch-break').uncheck();
  for (let i = 0; i < 8; i++) await sim.locator('[data-switch-step=next]').click();
  await expect(sim.locator('.output')).toHaveText('Start\nHelp\nAfter selection');
  await expect(sim.locator('[data-switch-step=next]')).toBeDisabled();
  await sim.locator('[data-switch-step=previous]').click();
  await sim.locator('[data-switch-step=previous]').click();
  await expect(sim.locator('.output')).toHaveText('Start\nHelp');
  await sim.locator('#switch-choice').selectOption('0');
  await expect(sim.locator('.output')).toHaveText('(no output)');
  await sim.locator('#switch-default').uncheck();
  for (let i = 0; i < 4; i++) await sim.locator('[data-switch-step=next]').click();
  await expect(sim.locator('.output')).toHaveText('After selection');
  await sim.locator('[data-switch-step=reset]').click();
  await expect(sim.locator('#switch-step-status')).toContainText('Ready');
});
test('switch content and payloads respect six languages and ten interface locales', async ({ page }) => {
  test.setTimeout(120000);
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  for (const locale of ['da', 'en', 'es', 'fr', 'de', 'pt', 'ar', 'ur', 'hi', 'zh']) for (const code of ['c', 'cpp', 'python', 'java', 'javascript', 'csharp']) {
    await page.goto(`/index.html?lang=${locale}&code=${code}#switch`);
    await expect(page.locator('#switch')).toBeVisible();
    await expect(page.locator('#switch-break')).toHaveCount(['python', 'csharp'].includes(code) ? 0 : 1);
    if (locale !== 'en') await expect(page.locator('#switch > .notice')).toBeVisible();
    await page.evaluate(() => { window.CodeRunner.open = p => { window.testSwitchPayload = p; }; });
    await page.locator('[data-switch-editor]').click();
    expect(await page.evaluate(() => window.testSwitchPayload.codeLanguage)).toBe(code);
    const download = page.waitForEvent('download'); await page.locator('[data-switch-download]').click();
    expect((await download).suggestedFilename()).toBe({ c: 'switch.c', cpp: 'switch.cpp', python: 'switch.py', java: 'Main.java', javascript: 'switch.js', csharp: 'Program.cs' }[code]);
    if (code === 'python') await expect(page.locator('#switch-simulator pre.for-source')).toContainText('match choice:');
  }
  expect(errors).toEqual([]);
});
test('language changes reset the trace and use distinct quizzes/progress', async ({ page }) => {
  await page.goto('/index.html?lang=en&code=c#switch');
  await page.locator('#switch-choice').selectOption('1'); await page.locator('#switch-break').uncheck();
  await page.locator('[data-switch-step=next]').click();
  await page.locator('#program-language').selectOption('python');
  await expect(page.locator('#switch-step-status')).toContainText('Ready');
  await expect(page.locator('#switch-break')).toHaveCount(0);
  await expect(page.locator('#switch-quiz')).toContainText('Does a matching Python case');
  const quiz = page.locator('#switch-quiz');
  for (const [i, choice] of [1, 1, 2, 1, 3].entries()) await quiz.locator('fieldset').nth(i).locator('input').nth(choice).check();
  await expect(quiz.locator('.quiz-score')).toContainText('5 / 5');
  await page.locator('[data-switch-complete]').click(); await page.reload();
  await expect(page.locator('#switch-progress')).toContainText('Best: 5/5');
  await page.locator('#program-language').selectOption('csharp');
  await expect(page.locator('#switch-progress')).toContainText('No completed quiz yet');
  await expect(page.locator('#switch-quiz')).toContainText('nonempty C# switch section');
});
test('switch mobile RTL and storage fallback remain accessible', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw Error('blocked'); } }));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.html?lang=ur&code=c#switch');
  await expect(page.locator('.switch-lesson')).toHaveAttribute('dir', 'ltr');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('[data-switch-complete]').click();
  await expect(page.locator('#switch-progress')).toContainText('page session only');
  await page.goto('/index.html?lang=en&code=c#arrays');
  await expect(page.locator('#arrays .topic-no')).toHaveText('07');
});
