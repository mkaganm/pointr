import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';
import { ApiHelpers } from '../../utils/api-helpers';
import { TestDataFactory } from '../../data/test-data';

test.describe('API | Site', () => {
  test('API | Site | create -> get -> delete [API]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });
    let created: any;

    // Step 1: Create a new site
    await allure.step('Step 1: Creating a new site...', async () => {
      console.log('Step 1: Creating a new site...');
      const siteData = TestDataFactory.createSite({ name: 'Hospital A', location: 'Istanbul' });
      const create = await api.post('/sites', { data: siteData });
      
      ApiHelpers.validateApiResponse(create, 201);
      
      created = await create.json();
      console.log(`Created site ID: ${created.id}`);
      console.log(`Expected: truthy value, Actual: ${created.id}`);
      expect(created.id).toBeTruthy();
      
      // Verify response structure
      ApiHelpers.verifyResponseStructure(created, ['id', 'name']);
    });

    // Step 2: Get the created site
    await allure.step('Step 2: Getting the created site...', async () => {
      console.log('Step 2: Getting the created site...');
      const retrievedSite = await ApiHelpers.verifySiteExists(api, created.id, {
        name: 'Hospital A'
      });
      
      console.log(`Retrieved site name: ${retrievedSite.name}`);
      console.log(`Expected: "Hospital A", Actual: "${retrievedSite.name}"`);
    });

    // Step 3: Delete the site
    await allure.step('Step 3: Deleting the site...', async () => {
      console.log('Step 3: Deleting the site...');
      const del = await api.delete(`/sites/${created.id}`);
      console.log(`Delete site response status: ${del.status()}`);
      console.log(`Expected: 204, Actual: ${del.status()}`);
      expect(del.status()).toBe(204);
    });

    // Step 4: Verify site is deleted
    await allure.step('Step 4: Verifying site is deleted...', async () => {
      console.log('Step 4: Verifying site is deleted...');
      await ApiHelpers.verifySiteNotExists(api, created.id);
      console.log('Site successfully deleted and verified as non-existent');
    });
  });
});
