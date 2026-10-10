const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests/browser',
  use: { baseURL: 'http://127.0.0.1:4173', headless: true },
  webServer: { command: 'node tests/serve.cjs', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
  workers: 2
});
