import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';
import { ApiHelpers } from '../../utils/api-helpers';
import { TestDataFactory } from '../../data/test-data';

test.describe('API | Site | Negative Tests', () => {
  test('API | Site | get non-existent site [NEGATIVE]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });

    // Step 1: Try to get site with invalid UUID
    await allure.step('Step 1: Getting site with invalid UUID...', async () => {
      console.log('Step 1: Getting site with invalid UUID...');
      const get = await api.get('/sites/invalid-uuid');
      console.log(`Get site response status: ${get.status()}`);
      console.log(`Expected: 400 or 404, Actual: ${get.status()}`);
      expect([400, 404]).toContain(get.status());
    });

    // Step 2: Try to get site with non-existent UUID
    await allure.step('Step 2: Getting site with non-existent UUID...', async () => {
      console.log('Step 2: Getting site with non-existent UUID...');
      const get = await api.get('/sites/12345678-1234-1234-1234-123456789abc');
      console.log(`Get site response status: ${get.status()}`);
      console.log(`Expected: 404, Actual: ${get.status()}`);
      expect(get.status()).toBe(404);
    });
  });



  test('API | Site | create site with edge cases [NEGATIVE]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });
    const edgeCases = TestDataFactory.createEdgeCaseSiteData();

    for (const edgeCase of edgeCases) {
      await allure.step(`Testing edge case: ${edgeCase.name}`, async () => {
        console.log(`Testing edge case: ${edgeCase.name}`);
        const response = await api.post('/sites', { data: edgeCase });
        console.log(`Response status: ${response.status()}`);
        // Edge cases should work (they are valid data)
        expect(response.status()).toBe(201);
        
        const created = await response.json();
        expect(created.id).toBeTruthy();
        
        // Cleanup
        await api.delete(`/sites/${created.id}`);
      });
    }
  });

  test('API | Site | delete non-existent site [NEGATIVE]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });

    // Step 1: Try to delete site with invalid UUID
    await allure.step('Step 1: Deleting site with invalid UUID...', async () => {
      console.log('Step 1: Deleting site with invalid UUID...');
      const del = await api.delete('/sites/invalid-uuid');
      console.log(`Delete site response status: ${del.status()}`);
      console.log(`Expected: 400 or 404, Actual: ${del.status()}`);
      expect([400, 404]).toContain(del.status());
    });

    // Step 2: Try to delete already deleted site
    await allure.step('Step 2: Deleting already deleted site...', async () => {
      console.log('Step 2: Deleting already deleted site...');
      const del = await api.delete('/sites/12345678-1234-1234-1234-123456789abc');
      console.log(`Delete site response status: ${del.status()}`);
      console.log(`Expected: 404, Actual: ${del.status()}`);
      expect(del.status()).toBe(404);
    });
  });



  test('API | Site | invalid HTTP methods [NEGATIVE]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });

    // Step 1: Try PUT method on sites endpoint
    await allure.step('Step 1: Using PUT method on sites endpoint...', async () => {
      console.log('Step 1: Using PUT method on sites endpoint...');
      const testData = TestDataFactory.createSite({ name: 'Test', location: 'Test' });
      const put = await api.put('/sites', { data: testData });
      console.log(`PUT site response status: ${put.status()}`);
      console.log(`Expected: 405, Actual: ${put.status()}`);
      expect(put.status()).toBe(405);
    });

    // Step 2: Try PATCH method on sites endpoint
    await allure.step('Step 2: Using PATCH method on sites endpoint...', async () => {
      console.log('Step 2: Using PATCH method on sites endpoint...');
      const testData = TestDataFactory.createSite({ name: 'Test' });
      const patch = await api.patch('/sites', { data: testData });
      console.log(`PATCH site response status: ${patch.status()}`);
      console.log(`Expected: 405, Actual: ${patch.status()}`);
      expect(patch.status()).toBe(405);
    });
  });
});
