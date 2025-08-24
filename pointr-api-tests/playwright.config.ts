import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:8081';
const environment = process.env.NODE_ENV || 'test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 0,
  use: { baseURL },
  reporter: [
    ['allure-playwright', { 
      detail: false, 
      suiteTitle: false,
      environmentInfo: {
        framework: 'Playwright',
        language: 'TypeScript',
        baseURL: baseURL,
        environment: environment,
        nodeVersion: process.version,
        platform: process.platform,
        timestamp: new Date().toISOString()
      },
      attachments: true,
      steps: true,
      // Hide console logs but show API call details
      includeConsoleLogs: false,
      includeTestSteps: true,
      includeTestBody: false,
      includeTestDescription: true,
      // Hide test details to prevent assertion info from showing
      includeTestDetails: false,
      includeTestParameters: false,
                  // Additional settings for better appearance
      categories: [
        {
          name: 'Failed tests',
          matchedStatuses: ['failed']
        },
        {
          name: 'Broken tests',
          matchedStatuses: ['broken']
        },
        {
          name: 'Ignored tests',
          matchedStatuses: ['skipped']
        },
        {
          name: 'Passed tests',
          matchedStatuses: ['passed']
        }
      ],
      // Custom labels
      labels: [
        { name: 'severity', value: 'critical' },
        { name: 'feature', value: 'API Testing' },
        { name: 'framework', value: 'Playwright' }
      ]
    }],
    ['html', { 
      open: 'never',
      outputFolder: 'playwright-report'
    }],
    ['list', { 
      printSteps: true 
    }],
    // JSON reporter for CI/CD
    ['json', { 
      outputFile: 'test-results/results.json' 
    }]
  ],
  // Test metadata
  metadata: {
    project: 'Pointr API Tests',
    version: '1.0.0',
    description: 'Comprehensive API testing suite for Pointr application'
  }
});
