import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';
import { ApiHelpers } from '../../utils/api-helpers';
import { AllureHelpers } from '../../utils/allure-helpers';
import { TestDataFactory } from '../../data/test-data';

test.describe('API | Building', () => {
  test.beforeEach(async () => {
    await allure.epic('API Testing');
    await allure.feature('Building Management');
    await allure.story('CRUD Operations');
    await allure.severity('critical');
    await allure.owner('QA Team');
    await allure.tag('api');
    await allure.tag('building');
    await allure.tag('crud');
  });

  test('API | Building | import -> get -> delete [API]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL: baseURL || 'http://host.docker.internal:8081' });
    let site: any, building: any;

    // Test description and link addition
    await allure.description('This test verifies building creation, reading, and deletion operations');
    await allure.link('API Documentation', 'https://api.example.com/building-docs');
    await allure.issue('PROJ-124', 'Building CRUD operations');

    // Step 1: Creating site and building
    await AllureHelpers.logStepWithConsole('Step 1: Creating site and building...', async () => {
      const siteData = TestDataFactory.createRealisticSiteData();
      const startTime = Date.now();
      const siteResponse = await api.post('/sites', { data: siteData });
      const siteResponseTime = Date.now() - startTime;
      
      ApiHelpers.validateApiResponse(siteResponse, 201);
      site = await siteResponse.json();
      
      // Log site creation API call
      await AllureHelpers.logApiCall(
        'POST',
        '/sites',
        siteResponse.status(),
        siteResponseTime,
        siteData,
        site
      );
      
      const buildingData = TestDataFactory.createBuilding(site.id, {
        name: 'Test Building',
        floors: 5
      });
      
      const buildingStartTime = Date.now();
      const buildingResponse = await api.post('/buildings', { 
        data: { 
          site_id: buildingData.siteId, 
          name: buildingData.name, 
          floors: buildingData.floors 
        } 
      });
      const buildingResponseTime = Date.now() - buildingStartTime;
      
      ApiHelpers.validateApiResponse(buildingResponse, 201);
      building = await buildingResponse.json();
      
      // Log building creation API call
      await AllureHelpers.logApiCall(
        'POST',
        '/buildings',
        buildingResponse.status(),
        buildingResponseTime,
        { 
          site_id: buildingData.siteId, 
          name: buildingData.name, 
          floors: buildingData.floors 
        },
        building
      );
      
      await AllureHelpers.logStep(`Created site ID: ${site.id}`, 'info');
      await AllureHelpers.logStep(`Created building ID: ${building.id}`, 'info');
    });

    // Step 2: Getting the created building
    await AllureHelpers.logStepWithConsole('Step 2: Getting the created building...', async () => {
      const startTime = Date.now();
      const getResponse = await api.get(`/buildings/${building.id}`);
      const responseTime = Date.now() - startTime;
      
      const retrievedBuilding = await getResponse.json();
      
      // Log API call to both console and Allure
      await AllureHelpers.logApiCall(
        'GET',
        `/buildings/${building.id}`,
        getResponse.status(),
        responseTime,
        { buildingId: building.id },
        retrievedBuilding
      );
      
      ApiHelpers.validateApiResponse(getResponse, 200);
      ApiHelpers.verifyResponseStructure(retrievedBuilding, ['id', 'name', 'site_id']);
    });

    // Step 3: Deleting the building
    await AllureHelpers.logStepWithConsole('Step 3: Deleting the building...', async () => {
      const startTime = Date.now();
      const deleteResponse = await api.delete(`/buildings/${building.id}`);
      const responseTime = Date.now() - startTime;
      
      // Log API call to both console and Allure
      await AllureHelpers.logApiCall(
        'DELETE',
        `/buildings/${building.id}`,
        deleteResponse.status(),
        responseTime,
        { buildingId: building.id },
        { status: deleteResponse.status() }
      );
      
      // Log assertion result
      await AllureHelpers.logAssertion(
        204,
        deleteResponse.status(),
        'toBe',
        deleteResponse.status() === 204
      );
      expect(deleteResponse.status()).toBe(204);
    });

    // Step 4: Verifying building is deleted
    await AllureHelpers.logStepWithConsole('Step 4: Verifying building is deleted...', async () => {
      const startTime = Date.now();
      const verifyResponse = await api.get(`/buildings/${building.id}`);
      const responseTime = Date.now() - startTime;
      
      // Log API call to both console and Allure
      await AllureHelpers.logApiCall(
        'GET',
        `/buildings/${building.id}`,
        verifyResponse.status(),
        responseTime,
        { buildingId: building.id },
        { status: verifyResponse.status() }
      );
      
      // Log assertion result
      await AllureHelpers.logAssertion(
        404,
        verifyResponse.status(),
        'toBe',
        verifyResponse.status() === 404
      );
      expect(verifyResponse.status()).toBe(404);
      await AllureHelpers.logStep('Building successfully deleted', 'info');
    });

    // Cleanup site
    await AllureHelpers.logStepWithConsole('Cleanup: Deleting test site...', async () => {
      await ApiHelpers.cleanupSite(api, site.id);
    });
  });
});
