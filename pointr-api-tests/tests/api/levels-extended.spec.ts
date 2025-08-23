import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';

test.describe('API | Levels | Extended Positive Tests', () => {
  test('API | Levels | create multiple levels with different indexes [EXTENDED]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });

    // Step 1: Create site and building
    await allure.step('Step 1: Creating site and building for multiple levels...', async () => {
      console.log('Step 1: Creating site and building for multiple levels...');
      const site = await (await api.post('/sites', { data: { name: 'Multi Level Campus', location: 'Test City' }})).json();
      console.log(`Created site ID: ${site.id}`);
      const bld = await (await api.post('/buildings', { data: { site_id: site.id, name: 'Multi Level Building' }})).json();
      console.log(`Created building ID: ${bld.id}`);
    });

    // Step 2: Create multiple levels with different indexes
    await allure.step('Step 2: Creating multiple levels with different indexes...', async () => {
      console.log('Step 2: Creating multiple levels with different indexes...');
      
      const site = await (await api.post('/sites', { data: { name: 'Multi Level Campus', location: 'Test City' }})).json();
      const bld = await (await api.post('/buildings', { data: { site_id: site.id, name: 'Multi Level Building' }})).json();
      
      const multi = await api.post('/levels', {
        data: {
          items: [
            { building_id: bld.id, name: 'Ground Floor', index: 0 },
            { building_id: bld.id, name: 'First Floor', index: 1 },
            { building_id: bld.id, name: 'Second Floor', index: 2 }
          ]
        }
      });
      console.log(`Create multiple levels response status: ${multi.status()}`);
      expect(multi.status()).toBe(201);
      
      const arr = await multi.json();
      console.log(`Number of imported levels: ${arr.items.length}`);
      expect(arr.items).toBeTruthy();
      expect(Array.isArray(arr.items)).toBeTruthy();
      expect(arr.items.length).toBe(3);
    });

    // Step 3: Verify each level has correct index
    await allure.step('Step 3: Verifying each level has correct index...', async () => {
      console.log('Step 3: Verifying each level has correct index...');
      
      const site = await (await api.post('/sites', { data: { name: 'Multi Level Campus', location: 'Test City' }})).json();
      const bld = await (await api.post('/buildings', { data: { site_id: site.id, name: 'Multi Level Building' }})).json();
      
      const multi = await api.post('/levels', {
        data: {
          items: [
            { building_id: bld.id, name: 'Ground Floor', index: 0 },
            { building_id: bld.id, name: 'First Floor', index: 1 },
            { building_id: bld.id, name: 'Second Floor', index: 2 }
          ]
        }
      });
      const arr = await multi.json();
      
      for (let i = 0; i < arr.items.length; i++) {
        const level = arr.items[i];
        console.log(`Verifying level: ${level.name} (ID: ${level.id}, Index: ${level.index})`);
        expect(level.index).toBe(i);
        
        const r = await api.get(`/levels/${level.id}`);
        expect(r.status()).toBe(200);
        
        const j = await r.json();
        console.log(`Retrieved level index: ${j.index}`);
        expect(j.index).toBe(i);
        expect(j.building_id).toBe(bld.id);
      }
    });
  });

  test('API | Levels | create level with special characters [EXTENDED]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });

    // Step 1: Create site and building
    await allure.step('Step 1: Creating site and building for special character level...', async () => {
      console.log('Step 1: Creating site and building for special character level...');
      const site = await (await api.post('/sites', { data: { name: 'Special Campus', location: 'Test City' }})).json();
      console.log(`Created site ID: ${site.id}`);
      const bld = await (await api.post('/buildings', { data: { site_id: site.id, name: 'Special Building' }})).json();
      console.log(`Created building ID: ${bld.id}`);
    });

    // Step 2: Create level with special characters in name
    await allure.step('Step 2: Creating level with special characters in name...', async () => {
      console.log('Step 2: Creating level with special characters in name...');
      
      const site = await (await api.post('/sites', { data: { name: 'Special Campus', location: 'Test City' }})).json();
      const bld = await (await api.post('/buildings', { data: { site_id: site.id, name: 'Special Building' }})).json();
      
      const create = await api.post('/levels', {
        data: { 
          building_id: bld.id, 
          name: 'Level & Floor (İstanbul)', 
          index: 1 
        }
      });
      console.log(`Create level with special characters response status: ${create.status()}`);
      expect(create.status()).toBe(201);
      
      const created = await create.json();
      console.log(`Created level ID: ${created.id}`);
      expect(created.id).toBeTruthy();
    });
  });

  test('API | Levels | relationship validation [EXTENDED]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });

    // Step 1: Create multiple buildings and levels
    await allure.step('Step 1: Creating multiple buildings and levels...', async () => {
      console.log('Step 1: Creating multiple buildings and levels...');
      
      const site1 = await api.post('/sites', { data: { name: 'Site A', location: 'Location A' }});
      const site1Data = await site1.json();
      const building1 = await api.post('/buildings', { data: { site_id: site1Data.id, name: 'Building A1' }});
      const building1Data = await building1.json();
      const level1 = await api.post('/levels', { data: { building_id: building1Data.id, name: 'Level A1', index: 1 }});
      const level1Data = await level1.json();
      
      const site2 = await api.post('/sites', { data: { name: 'Site B', location: 'Location B' }});
      const site2Data = await site2.json();
      const building2 = await api.post('/buildings', { data: { site_id: site2Data.id, name: 'Building B1' }});
      const building2Data = await building2.json();
      const level2 = await api.post('/levels', { data: { building_id: building2Data.id, name: 'Level B1', index: 1 }});
      const level2Data = await level2.json();
      
      console.log(`Created site A ID: ${site1Data.id}, Building A1 ID: ${building1Data.id}, Level A1 ID: ${level1Data.id}`);
      console.log(`Created site B ID: ${site2Data.id}, Building B1 ID: ${building2Data.id}, Level B1 ID: ${level2Data.id}`);
    });

    // Step 2: Verify level-building relationships
    await allure.step('Step 2: Verifying level-building relationships...', async () => {
      console.log('Step 2: Verifying level-building relationships...');
      
      const site1 = await api.post('/sites', { data: { name: 'Site A', location: 'Location A' }});
      const site1Data = await site1.json();
      const building1 = await api.post('/buildings', { data: { site_id: site1Data.id, name: 'Building A1' }});
      const building1Data = await building1.json();
      const level1 = await api.post('/levels', { data: { building_id: building1Data.id, name: 'Level A1', index: 1 }});
      const level1Data = await level1.json();
      
      const site2 = await api.post('/sites', { data: { name: 'Site B', location: 'Location B' }});
      const site2Data = await site2.json();
      const building2 = await api.post('/buildings', { data: { site_id: site2Data.id, name: 'Building B1' }});
      const building2Data = await building2.json();
      const level2 = await api.post('/levels', { data: { building_id: building2Data.id, name: 'Level B1', index: 1 }});
      const level2Data = await level2.json();
      
      // Verify level 1 belongs to building 1
      const getLevel1 = await api.get(`/levels/${level1Data.id}`);
      const level1Retrieved = await getLevel1.json();
      console.log(`Level A1 building_id: ${level1Retrieved.building_id}`);
      console.log(`Expected building A1 ID: ${building1Data.id}`);
      expect(level1Retrieved.building_id).toBe(building1Data.id);
      
      // Verify level 2 belongs to building 2
      const getLevel2 = await api.get(`/levels/${level2Data.id}`);
      const level2Retrieved = await getLevel2.json();
      console.log(`Level B1 building_id: ${level2Retrieved.building_id}`);
      console.log(`Expected building B1 ID: ${building2Data.id}`);
      expect(level2Retrieved.building_id).toBe(building2Data.id);
    });
  });
});
