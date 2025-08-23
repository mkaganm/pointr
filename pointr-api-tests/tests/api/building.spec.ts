import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';

test.describe('API | Building', () => {
  test('API | Building | import -> get -> delete [API]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });
    let site: any;
    let building: any;

    // Step 1: Create a site first
    await allure.step('Step 1: Creating a site for building...', async () => {
      console.log('Step 1: Creating a site for building...');
      const siteRes = await api.post('/sites', { data: { name: 'Campus-1', location: 'London' }});
      console.log(`Create site response status: ${siteRes.status()}`);
      console.log(`Expected: 201, Actual: ${siteRes.status()}`);
      expect(siteRes.ok()).toBeTruthy();
      site = await siteRes.json();
      console.log(`Created site ID: ${site.id}`);
    });

    // Step 2: Create a building
    await allure.step('Step 2: Creating a building...', async () => {
      console.log('Step 2: Creating a building...');
      const importRes = await api.post('/buildings', {
        data: { site_id: site.id, name: 'Building-A' }
      });
      console.log(`Create building response status: ${importRes.status()}`);
      console.log(`Expected: 201, Actual: ${importRes.status()}`);
      expect(importRes.status()).toBe(201);
      building = await importRes.json();
      console.log(`Created building ID: ${building.id}`);
    });

    // Step 3: Get the building
    await allure.step('Step 3: Getting the created building...', async () => {
      console.log('Step 3: Getting the created building...');
      const getRes = await api.get(`/buildings/${building.id}`);
      console.log(`Get building response status: ${getRes.status()}`);
      console.log(`Expected: 200, Actual: ${getRes.status()}`);
      expect(getRes.status()).toBe(200);
      
      const got = await getRes.json();
      console.log(`Building site_id: ${got.site_id}`);
      console.log(`Expected: "${site.id}", Actual: "${got.site_id}"`);
      expect(got.site_id).toBe(site.id);
    });

    // Step 4: Delete the building
    await allure.step('Step 4: Deleting the building...', async () => {
      console.log('Step 4: Deleting the building...');
      const delRes = await api.delete(`/buildings/${building.id}`);
      console.log(`Delete building response status: ${delRes.status()}`);
      console.log(`Expected: 204, Actual: ${delRes.status()}`);
      expect(delRes.status()).toBe(204);
    });
  });
});
