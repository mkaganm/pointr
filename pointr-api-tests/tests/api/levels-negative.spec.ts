import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';

test.describe('API | Levels | Negative Tests', () => {
  test('API | Levels | create multiple with invalid data [NEGATIVE]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });

    // Step 1: Create valid site and building for testing
    await allure.step('Step 1: Creating valid site and building for testing...', async () => {
      console.log('Step 1: Creating valid site and building for testing...');
      const site = await (await api.post('/sites', { data: { name: 'Test Campus 3', location: 'Test City 3' }})).json();
      console.log(`Created site ID: ${site.id}`);
      const bld = await (await api.post('/buildings', { data: { site_id: site.id, name: 'Test Building 3' }})).json();
      console.log(`Created building ID: ${bld.id}`);
    });

    // Step 2: Try to create multiple levels with invalid items array
    await allure.step('Step 2: Creating multiple levels with invalid items array...', async () => {
      console.log('Step 2: Creating multiple levels with invalid items array...');
      const create = await api.post('/levels', { 
        data: {
          items: [
            { building_id: '12345678-1234-1234-1234-123456789abc', name: 'L1', index: 1 },
            { building_id: '12345678-1234-1234-1234-123456789abc', name: 'L2', index: 2 }
          ]
        }
      });
      console.log(`Create multiple levels response status: ${create.status()}`);
      console.log(`Expected: 400 or 404, Actual: ${create.status()}`);
      expect([400, 404]).toContain(create.status());
    });

    // Step 3: Try to create multiple levels with empty items array
    await allure.step('Step 3: Creating multiple levels with empty items array...', async () => {
      console.log('Step 3: Creating multiple levels with empty items array...');
      const create = await api.post('/levels', { 
        data: {
          items: []
        }
      });
      console.log(`Create multiple levels response status: ${create.status()}`);
      console.log(`Expected: 400, Actual: ${create.status()}`);
      expect(create.status()).toBe(400);
    });
  });

  test('API | Levels | get non-existent level [NEGATIVE]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });

    // Step 1: Try to get level with invalid UUID
    await allure.step('Step 1: Getting level with invalid UUID...', async () => {
      console.log('Step 1: Getting level with invalid UUID...');
      const get = await api.get('/levels/invalid-uuid');
      console.log(`Get level response status: ${get.status()}`);
      console.log(`Expected: 400 or 404, Actual: ${get.status()}`);
      expect([400, 404]).toContain(get.status());
    });

    // Step 2: Try to get level with non-existent UUID
    await allure.step('Step 2: Getting level with non-existent UUID...', async () => {
      console.log('Step 2: Getting level with non-existent UUID...');
      const get = await api.get('/levels/12345678-1234-1234-1234-123456789abc');
      console.log(`Get level response status: ${get.status()}`);
      console.log(`Expected: 404, Actual: ${get.status()}`);
      expect(get.status()).toBe(404);
    });
  });

  test('API | Levels | invalid HTTP methods [NEGATIVE]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });

    // Step 1: Try PUT method on levels endpoint
    await allure.step('Step 1: Using PUT method on levels endpoint...', async () => {
      console.log('Step 1: Using PUT method on levels endpoint...');
      const put = await api.put('/levels', { 
        data: { 
          building_id: '12345678-1234-1234-1234-123456789abc', 
          name: 'Test Level', 
          index: 1 
        } 
      });
      console.log(`PUT level response status: ${put.status()}`);
      console.log(`Expected: 405, Actual: ${put.status()}`);
      expect(put.status()).toBe(405);
    });

    // Step 2: Try PATCH method on levels endpoint
    await allure.step('Step 2: Using PATCH method on levels endpoint...', async () => {
      console.log('Step 2: Using PATCH method on levels endpoint...');
      const patch = await api.patch('/levels', { data: { name: 'Test Level' } });
      console.log(`PATCH level response status: ${patch.status()}`);
      console.log(`Expected: 405, Actual: ${patch.status()}`);
      expect(patch.status()).toBe(405);
    });

    // Step 3: Try DELETE method on levels endpoint
    await allure.step('Step 3: Using DELETE method on levels endpoint...', async () => {
      console.log('Step 3: Using DELETE method on levels endpoint...');
      const del = await api.delete('/levels/12345678-1234-1234-1234-123456789abc');
      console.log(`DELETE level response status: ${del.status()}`);
      console.log(`Expected: 405, Actual: ${del.status()}`);
      expect(del.status()).toBe(405);
    });
  });
});
