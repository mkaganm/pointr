import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';

test.describe('API | Site | Extended Positive Tests', () => {
  test('API | Site | create multiple sites [EXTENDED]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });

    // Step 1: Create multiple sites
    await allure.step('Step 1: Creating multiple sites...', async () => {
      console.log('Step 1: Creating multiple sites...');
      
      const site1 = await api.post('/sites', { data: { name: 'Hospital A', location: 'Istanbul' } });
      console.log(`Create site 1 response status: ${site1.status()}`);
      expect(site1.status()).toBe(201);
      const created1 = await site1.json();
      console.log(`Created site 1 ID: ${created1.id}`);

      const site2 = await api.post('/sites', { data: { name: 'Hospital B', location: 'Ankara' } });
      console.log(`Create site 2 response status: ${site2.status()}`);
      expect(site2.status()).toBe(201);
      const created2 = await site2.json();
      console.log(`Created site 2 ID: ${created2.id}`);
    });

    // Step 2: Verify all sites were created
    await allure.step('Step 2: Verifying all sites were created...', async () => {
      console.log('Step 2: Verifying all sites were created...');
      
      const site1 = await api.post('/sites', { data: { name: 'Hospital A', location: 'Istanbul' } });
      const created1 = await site1.json();
      
      const site2 = await api.post('/sites', { data: { name: 'Hospital B', location: 'Ankara' } });
      const created2 = await site2.json();
      
      const get1 = await api.get(`/sites/${created1.id}`);
      console.log(`Get site 1 response status: ${get1.status()}`);
      expect(get1.status()).toBe(200);
      
      const get2 = await api.get(`/sites/${created2.id}`);
      console.log(`Get site 2 response status: ${get2.status()}`);
      expect(get2.status()).toBe(200);
    });
  });

  test('API | Site | create site with special characters [EXTENDED]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });

    // Step 1: Create site with special characters in name
    await allure.step('Step 1: Creating site with special characters in name...', async () => {
      console.log('Step 1: Creating site with special characters in name...');
      const create = await api.post('/sites', { 
        data: { 
          name: 'Hospital & Medical Center (İstanbul)', 
          location: 'İstanbul, Türkiye' 
        } 
      });
      console.log(`Create site response status: ${create.status()}`);
      expect(create.status()).toBe(201);
      
      const created = await create.json();
      console.log(`Created site ID: ${created.id}`);
      expect(created.id).toBeTruthy();
    });
  });

  test('API | Site | health check and root endpoints [EXTENDED]', async ({ baseURL }) => {
    const api = await request.newContext({ baseURL });

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
