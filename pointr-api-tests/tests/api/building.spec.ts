import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';
import { ApiHelpers } from '../../utils/api-helpers';
import { TestDataFactory } from '../../data/test-data';

test.describe('API | Building', () => {
  let api: any;
  let site: any;
  let building: any;

  test.beforeEach(async ({ baseURL }) => {
    api = await request.newContext({ baseURL });
  });

  test('API | Building | import -> get -> delete [API]', async () => {

    // Step 1: Create a site first
    await allure.step('Step 1: Creating a site for building...', async () => {
      console.log('Step 1: Creating a site for building...');
      const siteData = TestDataFactory.createRealisticSiteData();
      const siteId = await ApiHelpers.createSiteAndGetId(api, siteData);
      site = { id: siteId };
      console.log(`Created site ID: ${site.id}`);
    });

    // Step 2: Create a building
    await allure.step('Step 2: Creating a building...', async () => {
      console.log('Step 2: Creating a building...');
      const buildingData = TestDataFactory.createBuilding(site.id, {
        name: 'Building-A'
      });
      const buildingId = await ApiHelpers.createBuildingAndGetId(api, site.id, buildingData);
      building = { id: buildingId };
      console.log(`Created building ID: ${building.id}`);
    });

    // Step 3: Get the building
    await allure.step('Step 3: Getting the created building...', async () => {
      console.log('Step 3: Getting the created building...');
      const response = await api.get(`/buildings/${building.id}`);
      ApiHelpers.validateApiResponse(response, 200);
      
      const got = await response.json();
      console.log(`Building site_id: ${got.site_id}`);
      console.log(`Expected: "${site.id}", Actual: "${got.site_id}"`);
      expect(got.site_id).toBe(site.id);
      
      // Verify response structure
      ApiHelpers.verifyResponseStructure(got, ['id', 'name', 'site_id']);
    });

    // Step 4: Delete the building
    await allure.step('Step 4: Deleting the building...', async () => {
      console.log('Step 4: Deleting the building...');
      await ApiHelpers.cleanupBuilding(api, building.id);
      console.log('Building successfully deleted');
    });
  });

  test.afterEach(async () => {
    // Cleanup any remaining test data
    if (site?.id) {
      await ApiHelpers.cleanupSite(api, site.id);
    }
  });
});
