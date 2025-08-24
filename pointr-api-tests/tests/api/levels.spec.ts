import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';
import { ApiHelpers } from '../../utils/api-helpers';
import { AllureHelpers } from '../../utils/allure-helpers';
import { TestDataFactory } from '../../data/test-data';

test.describe('API | Levels', () => {
  test.beforeEach(async () => {
    // Test metadata ekleme
    await allure.epic('API Testing');
    await allure.feature('Level Management');
    await allure.story('CRUD Operations');
    await allure.severity('critical');
    await allure.owner('QA Team');
    await allure.tag('api');
    await allure.tag('levels');
    await allure.tag('crud');
  });

  test('API | Levels | import multiple [API]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL: baseURL || 'http://host.docker.internal:8081' });
    let site: any, bld: any;

    // Test description and link addition
    await allure.description('This test verifies multiple level creation and verification operations');
    await allure.link('API Documentation', 'https://api.example.com/levels-docs');
    await allure.issue('PROJ-125', 'Level CRUD operations');

    // Step 1: Create site and building
    await AllureHelpers.logStepWithConsole('Step 1: Creating site and building...', async () => {
      const siteData = TestDataFactory.createSite({ 
        name: 'Campus-2', 
        location: 'Berlin' 
      });
      const siteId = await ApiHelpers.createSiteAndGetId(api, siteData);
      site = { id: siteId };
      await AllureHelpers.logStep(`Created site ID: ${site.id}`, 'info');
      
      const buildingData = TestDataFactory.createBuilding(site.id, {
        name: 'B-1'
      });
      const buildingId = await ApiHelpers.createBuildingAndGetId(api, site.id, buildingData);
      bld = { id: buildingId };
      await AllureHelpers.logStep(`Created building ID: ${bld.id}`, 'info');
    });

    // Step 2: Import multiple levels
    await AllureHelpers.logStepWithConsole('Step 2: Importing multiple levels...', async () => {
      const startTime = Date.now();
      const multi = await api.post('/levels', {
        data: {
          items: [
            { building_id: bld.id, name: 'L1', index: 1 },
            { building_id: bld.id, name: 'L2', index: 2 },
            { building_id: bld.id, name: 'L3', index: 3 }
          ]
        }
      });
      const responseTime = Date.now() - startTime;
      
      // Log API call to both console and Allure
      await AllureHelpers.logApiCall(
        'POST',
        '/levels',
        multi.status(),
        responseTime,
        {
          items: [
            { building_id: bld.id, name: 'L1', index: 1 },
            { building_id: bld.id, name: 'L2', index: 2 },
            { building_id: bld.id, name: 'L3', index: 3 }
          ]
        },
        await multi.json()
      );
      
      if (multi.status() !== 201) {
        const errorBody = await multi.text();
        await AllureHelpers.logStep(`Error response: ${errorBody}`, 'error');
      }
      
      // Log assertion result
      await AllureHelpers.logAssertion(
        201,
        multi.status(),
        'toBe',
        multi.status() === 201
      );
      expect(multi.status()).toBe(201);
      
      const arr = await multi.json();
      
      // Log assertion result
      await AllureHelpers.logAssertion(
        3,
        arr.items.length,
        'toBe',
        arr.items.length === 3
      );
      expect(arr.items).toBeTruthy();
      expect(Array.isArray(arr.items)).toBeTruthy();
      expect(arr.items.length).toBe(3);
    });

    // Step 3: Verify each level
    await AllureHelpers.logStepWithConsole('Step 3: Verifying each imported level...', async () => {
      const startTime = Date.now();
      const multi = await api.post('/levels', {
        data: {
          items: [
            { building_id: bld.id, name: 'L1', index: 1 },
            { building_id: bld.id, name: 'L2', index: 2 },
            { building_id: bld.id, name: 'L3', index: 3 }
          ]
        }
      });
      const responseTime = Date.now() - startTime;
      
      // Log API call to both console and Allure
      await AllureHelpers.logApiCall(
        'POST',
        '/levels',
        multi.status(),
        responseTime,
        {
          items: [
            { building_id: bld.id, name: 'L1', index: 1 },
            { building_id: bld.id, name: 'L2', index: 2 },
            { building_id: bld.id, name: 'L3', index: 3 }
          ]
        },
        await multi.json()
      );
      
      const arr = await multi.json();
      
      for (const lv of arr.items) {
        await AllureHelpers.logStep(`Verifying level: ${lv.name} (ID: ${lv.id})`, 'info');
        
        const levelStartTime = Date.now();
        const r = await api.get(`/levels/${lv.id}`);
        const levelResponseTime = Date.now() - levelStartTime;
        
        // Log API call to both console and Allure
        await AllureHelpers.logApiCall(
          'GET',
          `/levels/${lv.id}`,
          r.status(),
          levelResponseTime,
          { levelId: lv.id },
          await r.json()
        );
        
        // Log assertion result
        await AllureHelpers.logAssertion(
          200,
          r.status(),
          'toBe',
          r.status() === 200
        );
        expect(r.status()).toBe(200);
        
        const j = await r.json();
        
        // Log assertion result
        await AllureHelpers.logAssertion(
          bld.id,
          j.building_id,
          'toBe',
          j.building_id === bld.id
        );
        expect(j.building_id).toBe(bld.id);
      }
    });

    // Cleanup
    await AllureHelpers.logStepWithConsole('Cleanup: Deleting test site...', async () => {
      await ApiHelpers.cleanupSite(api, site.id);
    });
  });

  test('API | Levels | single import [API]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL: baseURL || 'http://host.docker.internal:8081' });
    let site: any, bld: any, lv: any;

    // Test description and link addition
    await allure.description('This test verifies single level creation and verification operations');
    await allure.link('API Documentation', 'https://api.example.com/levels-docs');
    await allure.issue('PROJ-126', 'Single Level CRUD operations');

    // Step 1: Create site and building (reuse from previous test)
    await AllureHelpers.logStepWithConsole('Step 1: Creating site and building...', async () => {
      const siteData = TestDataFactory.createSite({ 
        name: 'Campus-3', 
        location: 'Paris' 
      });
      const siteId = await ApiHelpers.createSiteAndGetId(api, siteData);
      site = { id: siteId };
      await AllureHelpers.logStep(`Created site ID: ${site.id}`, 'info');
      
      const buildingData = TestDataFactory.createBuilding(site.id, {
        name: 'B-2'
      });
      const buildingId = await ApiHelpers.createBuildingAndGetId(api, site.id, buildingData);
      bld = { id: buildingId };
      await AllureHelpers.logStep(`Created building ID: ${bld.id}`, 'info');
    });

    // Step 2: Import single level
    await AllureHelpers.logStepWithConsole('Step 2: Importing single level...', async () => {
      const startTime = Date.now();
      
      // For single level, API expects different format
      const response = await api.post('/levels', { 
        data: { 
          building_id: bld.id, 
          name: 'Basement', 
          index: 0 
        } 
      });
      const responseTime = Date.now() - startTime;
      
      // Log API call to both console and Allure
      await AllureHelpers.logApiCall(
        'POST',
        '/levels',
        response.status(),
        responseTime,
        { 
          building_id: bld.id, 
          name: 'Basement', 
          index: 0 
        },
        await response.json()
      );
      
      ApiHelpers.validateApiResponse(response, 201);
      
      lv = await response.json();
      await AllureHelpers.logStep(`Created level ID: ${lv.id}`, 'info');
      
      // Verify response structure
      ApiHelpers.verifyResponseStructure(lv, ['id', 'name']);
    });

    // Step 3: Get the level
    await AllureHelpers.logStepWithConsole('Step 3: Getting the created level...', async () => {
      const startTime = Date.now();
      const response = await api.get(`/levels/${lv.id}`);
      const responseTime = Date.now() - startTime;
      
      // Log API call to both console and Allure
      await AllureHelpers.logApiCall(
        'GET',
        `/levels/${lv.id}`,
        response.status(),
        responseTime,
        { levelId: lv.id },
        await response.json()
      );
      
      ApiHelpers.validateApiResponse(response, 200);
      
      const level = await response.json();
      
      // Log assertion results
      await AllureHelpers.logAssertion(
        bld.id,
        level.building_id,
        'toBe',
        level.building_id === bld.id
      );
      expect(level.building_id).toBe(bld.id);
      
      await AllureHelpers.logAssertion(
        'Basement',
        level.name,
        'toBe',
        level.name === 'Basement'
      );
      expect(level.name).toBe('Basement');
    });

    // Cleanup
    await AllureHelpers.logStepWithConsole('Cleanup: Deleting test site...', async () => {
      await ApiHelpers.cleanupSite(api, site.id);
    });
  });
});
