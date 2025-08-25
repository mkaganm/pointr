// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:8081';
const environment = process.env.NODE_ENV || 'test';
const allureOut = process.env.ALLURE_RESULTS_DIR || 'allure-results';

export default defineConfig({
  // Test sources
  testDir: './tests',

  // Global timeouts / retries
  timeout: 30_000,
  retries: 0,

  // Default context/page options
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retry-with-video',
  },

  // Run at least 2 browsers (requirement). Add WebKit if you want 3.
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // { name: 'WebKit', use: { ...devices['Desktop Safari'] } },
  ],

  // Reporters: Allure (raw), Playwright HTML (pretty), list (console), JSON (CI)
  reporter: [
    ['allure-playwright', {
      // Raw Allure result files go here (bind-mounted in docker-compose)
      outputFolder: allureOut,
      // Include steps and attachments produced by the test runner
      detail: true,
      suiteTitle: false,
      // Shown in Allure "Environment" tab
      environmentInfo: {
        framework: 'Playwright',
        language: 'TypeScript',
        baseURL,
        environment,
        nodeVersion: process.version,
        platform: process.platform,
        timestamp: new Date().toISOString(),
      },
    }],
    ['html', {
      open: 'never',
      outputFolder: 'playwright-report',
    }],
    ['list', { printSteps: true }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  // Optional: tighten assertion timeout
  expect: {
    timeout: 5_000,
  },

  // Optional: shared output for traces/screenshots (kept default structure)
  outputDir: 'test-results',
});
