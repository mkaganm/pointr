import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';

test.describe('API | Levels', () => {
  test('API | Levels | import multiple [API]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });
    let site: any;
    let bld: any;

    // Step 1: Create site and building
    await allure.step('Step 1: Creating site and building...', async () => {
      console.log('Step 1: Creating site and building...');
      site = await (await api.post('/sites', { data: { name: 'Campus-2', location: 'Berlin' }})).json();
      console.log(`Created site ID: ${site.id}`);
      bld = await (await api.post('/buildings', { data: { site_id: site.id, name: 'B-1' }})).json();
      console.log(`Created building ID: ${bld.id}`);
    });

    // Step 2: Import multiple levels
    await allure.step('Step 2: Importing multiple levels...', async () => {
      console.log('Step 2: Importing multiple levels...');
      const multi = await api.post('/levels', {
        data: {
          items: [
            { building_id: bld.id, name: 'L1', index: 1 },
            { building_id: bld.id, name: 'L2', index: 2 },
            { building_id: bld.id, name: 'L3', index: 3 }
          ]
        }
      });
      if (multi.status() !== 201) {
        const errorBody = await multi.text();
        console.log('Error response:', errorBody);
      }
      console.log(`Import levels response status: ${multi.status()}`);
      console.log(`Expected: 201, Actual: ${multi.status()}`);
      expect(multi.status()).toBe(201);
      
      const arr = await multi.json();
      console.log(`Number of imported levels: ${arr.items.length}`);
      console.log(`Expected: 3, Actual: ${arr.items.length}`);
      expect(arr.items).toBeTruthy();
      expect(Array.isArray(arr.items)).toBeTruthy();
      expect(arr.items.length).toBe(3);
    });

    // Step 3: Verify each level
    await allure.step('Step 3: Verifying each imported level...', async () => {
      console.log('Step 3: Verifying each imported level...');
      const multi = await api.post('/levels', {
        data: {
          items: [
            { building_id: bld.id, name: 'L1', index: 1 },
            { building_id: bld.id, name: 'L2', index: 2 },
            { building_id: bld.id, name: 'L3', index: 3 }
          ]
        }
      });
      const arr = await multi.json();
      
      for (const lv of arr.items) {
        console.log(`Verifying level: ${lv.name} (ID: ${lv.id})`);
        const r = await api.get(`/levels/${lv.id}`);
        console.log(`Get level response status: ${r.status()}`);
        console.log(`Expected: 200, Actual: ${r.status()}`);
        expect(r.status()).toBe(200);
        
        const j = await r.json();
        console.log(`Level building_id: ${j.building_id}`);
        console.log(`Expected: "${bld.id}", Actual: "${j.building_id}"`);
        expect(j.building_id).toBe(bld.id);
      }
    });
  });

  test('API | Levels | single import [API]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });
    let site: any;
    let bld: any;
    let lv: any;

    // Step 1: Create site and building
    await allure.step('Step 1: Creating site and building...', async () => {
      console.log('Step 1: Creating site and building...');
      site = await (await api.post('/sites', { data: { name: 'Campus-3', location: 'Paris' }})).json();
      console.log(`Created site ID: ${site.id}`);
      bld = await (await api.post('/buildings', { data: { site_id: site.id, name: 'B-2' }})).json();
      console.log(`Created building ID: ${bld.id}`);
    });

    // Step 2: Import single level
    await allure.step('Step 2: Importing single level...', async () => {
      console.log('Step 2: Importing single level...');
      const single = await api.post('/levels', {
        data: { building_id: bld.id, name: 'Basement', index: 0 }
      });
      console.log(`Import single level response status: ${single.status()}`);
      console.log(`Expected: 201, Actual: ${single.status()}`);
      expect(single.status()).toBe(201);
      lv = await single.json();
      console.log(`Created level ID: ${lv.id}`);
    });

    // Step 3: Get the level
    await allure.step('Step 3: Getting the created level...', async () => {
      console.log('Step 3: Getting the created level...');
      const get = await api.get(`/levels/${lv.id}`);
      console.log(`Get level response status: ${get.status()}`);
      console.log(`Expected: 200, Actual: ${get.status()}`);
      expect(get.status()).toBe(200);
    });
  });
});
