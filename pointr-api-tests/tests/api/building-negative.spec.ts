import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';
import { ApiHelpers } from '../../utils/api-helpers';
import { AllureHelpers } from '../../utils/allure-helpers';

test.describe('API | Building | Negative Tests', () => {
  test.beforeEach(async () => {
    // Test metadata ekleme
    await allure.epic('API Testing');
    await allure.feature('Building Management');
    await allure.story('Negative Testing');
    await allure.severity('critical');
    await allure.owner('QA Team');
    await allure.tag('api');
    await allure.tag('building');
    await allure.tag('negative');
  });

  test('API | Building | get non-existent building [NEGATIVE]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL: baseURL || 'http://host.docker.internal:8081' });

    // Test description and link addition
    await allure.description('This test verifies building API error handling for non-existent buildings');
    await allure.link('API Documentation', 'https://api.example.com/building-docs');
    await allure.issue('PROJ-143', 'Building error handling');

    // Step 1: Try to get building with invalid UUID
    await AllureHelpers.logStepWithConsole('Step 1: Getting building with invalid UUID...', async () => {
      const startTime = Date.now();
      const get = await api.get('/buildings/invalid-uuid');
      const responseTime = Date.now() - startTime;
      
      // Log API call to both console and Allure
      await AllureHelpers.logApiCall(
        'GET',
        '/buildings/invalid-uuid',
        get.status(),
        responseTime,
        { invalidId: 'invalid-uuid' },
        { status: get.status() }
      );
      
      // Log assertion result
      await AllureHelpers.logAssertion(
        [400, 404],
        get.status(),
        'toContain',
        [400, 404].includes(get.status())
      );
      expect([400, 404]).toContain(get.status());
    });

    // Step 2: Try to get building with non-existent UUID
    await AllureHelpers.logStepWithConsole('Step 2: Getting building with non-existent UUID...', async () => {
      const startTime = Date.now();
      const get = await api.get('/buildings/12345678-1234-1234-1234-123456789abc');
      const responseTime = Date.now() - startTime;
      
      // Log API call to both console and Allure
      await AllureHelpers.logApiCall(
        'GET',
        '/buildings/12345678-1234-1234-1234-123456789abc',
        get.status(),
        responseTime,
        { nonExistentId: '12345678-1234-1234-1234-123456789abc' },
        { status: get.status() }
      );
      
      // Log assertion result
      await AllureHelpers.logAssertion(
        404,
        get.status(),
        'toBe',
        get.status() === 404
      );
      expect(get.status()).toBe(404);
    });
  });
});