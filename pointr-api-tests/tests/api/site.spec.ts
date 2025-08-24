import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';
import { ApiHelpers } from '../../utils/api-helpers';
import { AllureHelpers } from '../../utils/allure-helpers';
import { TestDataFactory } from '../../data/test-data';

test.describe('API | Site', () => {
  test.beforeEach(async () => {
    // Test metadata ekleme
    await allure.epic('API Testing');
    await allure.feature('Site Management');
    await allure.story('CRUD Operations');
    await allure.severity('critical');
    await allure.owner('QA Team');
    await allure.tag('api');
    await allure.tag('site');
    await allure.tag('crud');
  });

  test('API | Site | create -> get -> delete [API]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL: baseURL || 'http://host.docker.internal:8081' });
    let created: any;

    // Test description and link addition
    await allure.description('This test verifies site creation, reading, and deletion operations');
    await allure.link('API Documentation', 'https://api.example.com/docs');
    await allure.issue('PROJ-123', 'Site CRUD operations');

    // Step 1: Create a new site
    await AllureHelpers.logStepWithConsole('Step 1: Creating a new site...', async () => {
      const siteData = TestDataFactory.createSite({ name: 'Hospital A', location: 'Istanbul' });
      
      const startTime = Date.now();
      const create = await api.post('/sites', { data: siteData });
      const responseTime = Date.now() - startTime;
      
      ApiHelpers.validateApiResponse(create, 201);
      
      created = await create.json();
      
      // Log API call to both console and Allure
      await AllureHelpers.logApiCall(
        'POST',
        '/sites',
        create.status(),
        responseTime,
        siteData,
        created
      );
      
      // Log assertion result
      await AllureHelpers.logAssertion(
        'truthy value',
        created.id,
        'toBeTruthy',
        !!created.id
      );
      expect(created.id).toBeTruthy();
      
      // Verify response structure
      ApiHelpers.verifyResponseStructure(created, ['id', 'name']);
    });

    // Step 2: Get the created site
    await AllureHelpers.logStepWithConsole('Step 2: Getting the created site...', async () => {
      const startTime = Date.now();
      const getResponse = await api.get(`/sites/${created.id}`);
      const responseTime = Date.now() - startTime;
      
      const retrievedSite = await getResponse.json();
      
      // Log API call to both console and Allure
      await AllureHelpers.logApiCall(
        'GET',
        `/sites/${created.id}`,
        getResponse.status(),
        responseTime,
        { siteId: created.id },
        retrievedSite
      );
      
      // Log assertion result
      await AllureHelpers.logAssertion(
        'Hospital A',
        retrievedSite.name,
        'toBe',
        retrievedSite.name === 'Hospital A'
      );
    });

    // Step 3: Delete the site
    await AllureHelpers.logStepWithConsole('Step 3: Deleting the site...', async () => {
      const startTime = Date.now();
      const del = await api.delete(`/sites/${created.id}`);
      const responseTime = Date.now() - startTime;
      
      // Log API call to both console and Allure
      await AllureHelpers.logApiCall(
        'DELETE',
        `/sites/${created.id}`,
        del.status(),
        responseTime,
        { siteId: created.id },
        { status: del.status() }
      );
      
      // Log assertion result
      await AllureHelpers.logAssertion(
        204,
        del.status(),
        'toBe',
        del.status() === 204
      );
      expect(del.status()).toBe(204);
    });

    // Step 4: Verify site is deleted
    await AllureHelpers.logStepWithConsole('Step 4: Verifying site is deleted...', async () => {
      const startTime = Date.now();
      const verifyResponse = await api.get(`/sites/${created.id}`);
      const responseTime = Date.now() - startTime;
      
      // Log API call to both console and Allure
      await AllureHelpers.logApiCall(
        'GET',
        `/sites/${created.id}`,
        verifyResponse.status(),
        responseTime,
        { siteId: created.id },
        { status: verifyResponse.status() }
      );
      
      await ApiHelpers.verifySiteNotExists(api, created.id);
      await AllureHelpers.logStep('Site successfully deleted and verified as non-existent', 'info');
    });
  });
});
