import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:8081';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 0,
  use: { baseURL },
  reporter: [
    ['allure-playwright', { 
      detail: true, 
      suiteTitle: false,
      environmentInfo: {
        framework: 'Playwright',
        language: 'TypeScript',
        baseURL: baseURL
      },
      attachments: true,
      steps: true
    }],
    ['html', { open: 'never' }],
    ['list']
  ],
});
