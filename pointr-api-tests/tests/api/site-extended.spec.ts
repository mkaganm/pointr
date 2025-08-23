import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';
import { ApiHelpers } from '../../utils/api-helpers';
import { TestDataFactory } from '../../data/test-data';

test.describe('API | Site | Extended Positive Tests', () => {
  let api: any;
  let createdSiteIds: string[] = [];

  test.beforeEach(async ({ baseURL }) => {
    api = await request.newContext({ baseURL });
  });

  test.afterEach(async () => {
    // Cleanup created sites
    for (const siteId of createdSiteIds) {
      await ApiHelpers.cleanupSite(api, siteId);
    }
    createdSiteIds = [];
  });

  test('API | Site | create multiple sites [EXTENDED]', async () => {

    // Step 1: Create multiple sites
    await allure.step('Step 1: Creating multiple sites...', async () => {
      console.log('Step 1: Creating multiple sites...');
      
      const site1Data = TestDataFactory.createRealisticSiteData();
      const site1Id = await ApiHelpers.createSiteAndGetId(api, site1Data);
      createdSiteIds.push(site1Id);
      console.log(`Created site 1 ID: ${site1Id}`);

      const site2Data = TestDataFactory.createRealisticSiteData();
      const site2Id = await ApiHelpers.createSiteAndGetId(api, site2Data);
      createdSiteIds.push(site2Id);
      console.log(`Created site 2 ID: ${site2Id}`);
    });

    // Step 2: Verify all sites were created
    await allure.step('Step 2: Verifying all sites were created...', async () => {
      console.log('Step 2: Verifying all sites were created...');
      
      // Verify first site
      const site1 = await ApiHelpers.verifySiteExists(api, createdSiteIds[0]);
      console.log(`Verified site 1: ${site1.name}`);
      
      // Verify second site
      const site2 = await ApiHelpers.verifySiteExists(api, createdSiteIds[1]);
      console.log(`Verified site 2: ${site2.name}`);
    });
  });

  test('API | Site | create site with special characters [EXTENDED]', async () => {
    let specialSiteId: string;

    // Step 1: Create site with special characters in name
    await allure.step('Step 1: Creating site with special characters in name...', async () => {
      console.log('Step 1: Creating site with special characters in name...');
      
      const specialSiteData = TestDataFactory.createSite({ 
        name: 'Hospital & Medical Center (İstanbul)', 
        location: 'İstanbul, Türkiye' 
      });
      
      specialSiteId = await ApiHelpers.createSiteAndGetId(api, specialSiteData);
      createdSiteIds.push(specialSiteId);
      
      console.log(`Created site ID: ${specialSiteId}`);
    });
  });

  test('API | Site | health check and root endpoints [EXTENDED]', async () => {

    // Step 1: Check health endpoint
    await allure.step('Step 1: Checking health endpoint...', async () => {
      console.log('Step 1: Checking health endpoint...');
      const health = await api.get('/health');
      console.log(`Health check response status: ${health.status()}`);
      expect(health.status()).toBe(200);
      
      const healthData = await health.json();
      console.log(`Health check response: ${JSON.stringify(healthData)}`);
      expect(healthData.status).toBe('ok');
    });

    // Step 2: Check root endpoint
    await allure.step('Step 2: Checking root endpoint...', async () => {
      console.log('Step 2: Checking root endpoint...');
      const root = await api.get('/');
      console.log(`Root endpoint response status: ${root.status()}`);
      expect(root.status()).toBe(200);
      
      const rootData = await root.json();
      console.log(`Root endpoint response: ${JSON.stringify(rootData)}`);
      expect(rootData.message).toBeTruthy();
      expect(rootData.counts).toBeTruthy();
      expect(rootData.counts.sites).toBeGreaterThanOrEqual(0);
      expect(rootData.counts.buildings).toBeGreaterThanOrEqual(0);
      expect(rootData.counts.levels).toBeGreaterThanOrEqual(0);
    });
  });
});
