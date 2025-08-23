import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';
import { ApiHelpers } from '../../utils/api-helpers';
import { TestDataFactory } from '../../data/test-data';

test.describe('API | Levels', () => {
  let api: any;
  let site: any;
  let bld: any;

  test.beforeEach(async ({ baseURL }) => {
    api = await request.newContext({ baseURL });
  });

  test('API | Levels | import multiple [API]', async () => {

    // Step 1: Create site and building
    await allure.step('Step 1: Creating site and building...', async () => {
      console.log('Step 1: Creating site and building...');
      const siteData = TestDataFactory.createSite({ 
        name: 'Campus-2', 
        location: 'Berlin' 
      });
      const siteId = await ApiHelpers.createSiteAndGetId(api, siteData);
      site = { id: siteId };
      console.log(`Created site ID: ${site.id}`);
      
      const buildingData = TestDataFactory.createBuilding(site.id, {
        name: 'B-1'
      });
      const buildingId = await ApiHelpers.createBuildingAndGetId(api, site.id, buildingData);
      bld = { id: buildingId };
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

  test('API | Levels | single import [API]', async () => {
    let lv: any;

    // Step 1: Create site and building (reuse from previous test)
    await allure.step('Step 1: Creating site and building...', async () => {
      console.log('Step 1: Creating site and building...');
      const siteData = TestDataFactory.createSite({ 
        name: 'Campus-3', 
        location: 'Paris' 
      });
      const siteId = await ApiHelpers.createSiteAndGetId(api, siteData);
      site = { id: siteId };
      console.log(`Created site ID: ${site.id}`);
      
      const buildingData = TestDataFactory.createBuilding(site.id, {
        name: 'B-2'
      });
      const buildingId = await ApiHelpers.createBuildingAndGetId(api, site.id, buildingData);
      bld = { id: buildingId };
      console.log(`Created building ID: ${bld.id}`);
    });

    // Step 2: Import single level
    await allure.step('Step 2: Importing single level...', async () => {
      console.log('Step 2: Importing single level...');
      
      // For single level, API expects different format
      const response = await api.post('/levels', { 
        data: { 
          building_id: bld.id, 
          name: 'Basement', 
          index: 0 
        } 
      });
      ApiHelpers.validateApiResponse(response, 201);
      
      lv = await response.json();
      console.log(`Created level ID: ${lv.id}`);
      
      // Verify response structure
      ApiHelpers.verifyResponseStructure(lv, ['id', 'name']);
    });

    // Step 3: Get the level
    await allure.step('Step 3: Getting the created level...', async () => {
      console.log('Step 3: Getting the created level...');
      const response = await api.get(`/levels/${lv.id}`);
      ApiHelpers.validateApiResponse(response, 200);
      
      const level = await response.json();
      expect(level.building_id).toBe(bld.id);
      expect(level.name).toBe('Basement');
    });
  });

  test.afterEach(async () => {
    // Cleanup any remaining test data
    if (site?.id) {
      await ApiHelpers.cleanupSite(api, site.id);
    }
  });
});
