import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';
import { ApiHelpers } from '../../utils/api-helpers';
import { TestDataFactory } from '../../data/test-data';

test.describe('API | Building | Negative Tests', () => {
  test('API | Building | get non-existent building [NEGATIVE]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });

    // Step 1: Try to get building with invalid UUID
    await allure.step('Step 1: Getting building with invalid UUID...', async () => {
      console.log('Step 1: Getting building with invalid UUID...');
      const get = await api.get('/buildings/invalid-uuid');
      console.log(`Get building response status: ${get.status()}`);
      console.log(`Expected: 400 or 404, Actual: ${get.status()}`);
      expect([400, 404]).toContain(get.status());
    });

    // Step 2: Try to get building with non-existent UUID
    await allure.step('Step 2: Getting building with non-existent UUID...', async () => {
      console.log('Step 2: Getting building with non-existent UUID...');
      const get = await api.get('/buildings/12345678-1234-1234-1234-123456789abc');
      console.log(`Get building response status: ${get.status()}`);
      console.log(`Expected: 404, Actual: ${get.status()}`);
      expect(get.status()).toBe(404);
    });
  });

  test('API | Building | delete non-existent building [NEGATIVE]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });

    // Step 1: Try to delete building with invalid UUID
    await allure.step('Step 1: Deleting building with invalid UUID...', async () => {
      console.log('Step 1: Deleting building with invalid UUID...');
      const del = await api.delete('/buildings/invalid-uuid');
      console.log(`Delete building response status: ${del.status()}`);
      console.log(`Expected: 400 or 404, Actual: ${del.status()}`);
      expect([400, 404]).toContain(del.status());
    });

    // Step 2: Try to delete already deleted building
    await allure.step('Step 2: Deleting already deleted building...', async () => {
      console.log('Step 2: Deleting already deleted building...');
      const del = await api.delete('/buildings/12345678-1234-1234-1234-123456789abc');
      console.log(`Delete building response status: ${del.status()}`);
      console.log(`Expected: 404, Actual: ${del.status()}`);
      expect(del.status()).toBe(404);
    });
  });

  test('API | Building | invalid HTTP methods [NEGATIVE]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });

    // Step 1: Try PUT method on buildings endpoint
    await allure.step('Step 1: Using PUT method on buildings endpoint...', async () => {
      console.log('Step 1: Using PUT method on buildings endpoint...');
      const put = await api.put('/buildings', { 
        data: { 
          site_id: '12345678-1234-1234-1234-123456789abc', 
          name: 'Test Building' 
        } 
      });
      console.log(`PUT building response status: ${put.status()}`);
      console.log(`Expected: 405, Actual: ${put.status()}`);
      expect(put.status()).toBe(405);
    });

    // Step 2: Try PATCH method on buildings endpoint
    await allure.step('Step 2: Using PATCH method on buildings endpoint...', async () => {
      console.log('Step 2: Using PATCH method on buildings endpoint...');
      const patch = await api.patch('/buildings', { data: { name: 'Test Building' } });
      console.log(`PATCH building response status: ${patch.status()}`);
      console.log(`Expected: 405, Actual: ${patch.status()}`);
      expect(patch.status()).toBe(405);
    });
  });
});
