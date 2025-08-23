import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';

test.describe('API | Site', () => {
  test('API | Site | create -> get -> delete [API]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });
    let created: any;

    // Step 1: Create a new site
    await allure.step('Step 1: Creating a new site...', async () => {
      console.log('Step 1: Creating a new site...');
      const create = await api.post('/sites', { data: { name: 'Hospital A', location: 'Istanbul' } });
      console.log(`Create site response status: ${create.status()}`);
      console.log(`Expected: 201, Actual: ${create.status()}`);
      expect(create.status()).toBe(201);
      
      created = await create.json();
      console.log(`Created site ID: ${created.id}`);
      console.log(`Expected: truthy value, Actual: ${created.id}`);
      expect(created.id).toBeTruthy();
    });

    // Step 2: Get the created site
    await allure.step('Step 2: Getting the created site...', async () => {
      console.log('Step 2: Getting the created site...');
      const get = await api.get(`/sites/${created.id}`);
      console.log(`Get site response status: ${get.status()}`);
      console.log(`Expected: 200, Actual: ${get.status()}`);
      expect(get.status()).toBe(200);
      
      const got = await get.json();
      console.log(`Retrieved site name: ${got.name}`);
      console.log(`Expected: "Hospital A", Actual: "${got.name}"`);
      expect(got.name).toBe('Hospital A');
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
      const getMissing = await api.get(`/sites/${created.id}`);
      console.log(`Get deleted site response status: ${getMissing.status()}`);
      console.log(`Expected: 404, Actual: ${getMissing.status()}`);
      expect(getMissing.status()).toBe(404);
    });
  });
});
