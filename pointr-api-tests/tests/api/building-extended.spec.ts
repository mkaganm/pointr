import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';
import { ApiHelpers } from '../../utils/api-helpers';
import { TestDataFactory } from '../../data/test-data';

test.describe('API | Building | Extended Positive Tests', () => {
  test('API | Building | create multiple buildings [EXTENDED]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });

    // Step 1: Create a site first
    await allure.step('Step 1: Creating a site for multiple buildings...', async () => {
      console.log('Step 1: Creating a site for multiple buildings...');
      const siteData = TestDataFactory.createRealisticSiteData();
      const siteRes = await api.post('/sites', { data: siteData });
      console.log(`Create site response status: ${siteRes.status()}`);
      expect(siteRes.status()).toBe(201);
      const site = await siteRes.json();
      console.log(`Created site ID: ${site.id}`);
    });

    // Step 2: Create multiple buildings
    await allure.step('Step 2: Creating multiple buildings...', async () => {
      console.log('Step 2: Creating multiple buildings...');
      
      const siteData = TestDataFactory.createSite({ name: 'Multi Building Campus', location: 'Test City' });
      const siteRes = await api.post('/sites', { data: siteData });
      const site = await siteRes.json();
      
      const building1Data = TestDataFactory.createBuilding(site.id, { name: 'Building A' });
      const building1 = await api.post('/buildings', { data: { site_id: building1Data.siteId, name: building1Data.name, floors: building1Data.floors } });
      console.log(`Create building 1 response status: ${building1.status()}`);
      expect(building1.status()).toBe(201);
      const created1 = await building1.json();
      console.log(`Created building 1 ID: ${created1.id}`);

      const building2Data = TestDataFactory.createBuilding(site.id, { name: 'Building B' });
      const building2 = await api.post('/buildings', { data: { site_id: building2Data.siteId, name: building2Data.name, floors: building2Data.floors } });
      console.log(`Create building 2 response status: ${building2.status()}`);
      expect(building2.status()).toBe(201);
      const created2 = await building2.json();
      console.log(`Created building 2 ID: ${created2.id}`);
    });

    // Step 3: Verify buildings were created
    await allure.step('Step 3: Verifying buildings were created...', async () => {
      console.log('Step 3: Verifying buildings were created...');
      
      const siteData = TestDataFactory.createSite({ name: 'Multi Building Campus', location: 'Test City' });
      const siteRes = await api.post('/sites', { data: siteData });
      const site = await siteRes.json();
      
      const building1Data = TestDataFactory.createBuilding(site.id, { name: 'Building A' });
      const building1 = await api.post('/buildings', { data: { site_id: building1Data.siteId, name: building1Data.name, floors: building1Data.floors } });
      const created1 = await building1.json();
      
      const building2Data = TestDataFactory.createBuilding(site.id, { name: 'Building B' });
      const building2 = await api.post('/buildings', { data: { site_id: building2Data.siteId, name: building2Data.name, floors: building2Data.floors } });
      const created2 = await building2.json();
      
      const get1 = await api.get(`/buildings/${created1.id}`);
      console.log(`Get building 1 response status: ${get1.status()}`);
      expect(get1.status()).toBe(200);
      
      const get2 = await api.get(`/buildings/${created2.id}`);
      console.log(`Get building 2 response status: ${get2.status()}`);
      expect(get2.status()).toBe(200);
    });
  });

  test('API | Building | create building with special characters [EXTENDED]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });

    // Step 1: Create a site first
    await allure.step('Step 1: Creating a site for special character building...', async () => {
      console.log('Step 1: Creating a site for special character building...');
      const siteData = TestDataFactory.createSite({ name: 'Special Campus', location: 'Test City' });
      const siteRes = await api.post('/sites', { data: siteData });
      console.log(`Create site response status: ${siteRes.status()}`);
      expect(siteRes.status()).toBe(201);
      const site = await siteRes.json();
      console.log(`Created site ID: ${site.id}`);
    });

    // Step 2: Create building with special characters in name
    await allure.step('Step 2: Creating building with special characters in name...', async () => {
      console.log('Step 2: Creating building with special characters in name...');
      const siteData = TestDataFactory.createSite({ name: 'Special Campus', location: 'Test City' });
      const siteRes = await api.post('/sites', { data: siteData });
      const site = await siteRes.json();
      
      const buildingData = TestDataFactory.createBuilding(site.id, { name: 'Building & Medical Center (İstanbul)' });
      const create = await api.post('/buildings', { 
        data: { 
          site_id: buildingData.siteId, 
          name: buildingData.name,
          floors: buildingData.floors 
        } 
      });
      console.log(`Create building response status: ${create.status()}`);
      expect(create.status()).toBe(201);
      
      const created = await create.json();
      console.log(`Created building ID: ${created.id}`);
      expect(created.id).toBeTruthy();
    });
  });

  test('API | Building | relationship validation [EXTENDED]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });

    // Step 1: Create multiple sites and buildings
    await allure.step('Step 1: Creating multiple sites and buildings...', async () => {
      console.log('Step 1: Creating multiple sites and buildings...');
      
      const site1Data = TestDataFactory.createSite({ name: 'Site A', location: 'Location A' });
      const site1 = await api.post('/sites', { data: site1Data });
      const site1Json = await site1.json();
      const building1Data = TestDataFactory.createBuilding(site1Json.id, { name: 'Building A1' });
      const building1 = await api.post('/buildings', { data: { site_id: building1Data.siteId, name: building1Data.name, floors: building1Data.floors }});
      const building1Json = await building1.json();
      
      const site2Data = TestDataFactory.createSite({ name: 'Site B', location: 'Location B' });
      const site2 = await api.post('/sites', { data: site2Data });
      const site2Json = await site2.json();
      const building2Data = TestDataFactory.createBuilding(site2Json.id, { name: 'Building B1' });
      const building2 = await api.post('/buildings', { data: { site_id: building2Data.siteId, name: building2Data.name, floors: building2Data.floors }});
      const building2Json = await building2.json();
      
      console.log(`Created site A ID: ${site1Json.id}, Building A1 ID: ${building1Json.id}`);
      console.log(`Created site B ID: ${site2Json.id}, Building B1 ID: ${building2Json.id}`);
    });

    // Step 2: Verify building-site relationships
    await allure.step('Step 2: Verifying building-site relationships...', async () => {
      console.log('Step 2: Verifying building-site relationships...');
      
      const site1Data = TestDataFactory.createSite({ name: 'Site A', location: 'Location A' });
      const site1 = await api.post('/sites', { data: site1Data });
      const site1Json = await site1.json();
      const building1Data = TestDataFactory.createBuilding(site1Json.id, { name: 'Building A1' });
      const building1 = await api.post('/buildings', { data: { site_id: building1Data.siteId, name: building1Data.name, floors: building1Data.floors }});
      const building1Json = await building1.json();
      
      const site2Data = TestDataFactory.createSite({ name: 'Site B', location: 'Location B' });
      const site2 = await api.post('/sites', { data: site2Data });
      const site2Json = await site2.json();
      const building2Data = TestDataFactory.createBuilding(site2Json.id, { name: 'Building B1' });
      const building2 = await api.post('/buildings', { data: { site_id: building2Data.siteId, name: building2Data.name, floors: building2Data.floors }});
      const building2Json = await building2.json();
      
      // Verify building 1 belongs to site 1
      const getBuilding1 = await api.get(`/buildings/${building1Json.id}`);
      const building1Retrieved = await getBuilding1.json();
      console.log(`Building A1 site_id: ${building1Retrieved.site_id}`);
      console.log(`Expected site A ID: ${site1Json.id}`);
      expect(building1Retrieved.site_id).toBe(site1Json.id);
      
      // Verify building 2 belongs to site 2
      const getBuilding2 = await api.get(`/buildings/${building2Json.id}`);
      const building2Retrieved = await getBuilding2.json();
      console.log(`Building B1 site_id: ${building2Retrieved.site_id}`);
      console.log(`Expected site B ID: ${site2Json.id}`);
      expect(building2Retrieved.site_id).toBe(site2Json.id);
    });
  });
});
