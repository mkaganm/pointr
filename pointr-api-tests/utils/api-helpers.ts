import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { Site, Building, Level, CreateSiteRequest, CreateBuildingRequest, CreateLevelRequest } from '../types';
import { TestDataFactory } from '../data/test-data';

export class ApiHelpers {
  /**
   * Create a site and return its ID
   */
  static async createSiteAndGetId(api: any, siteData?: Partial<CreateSiteRequest>): Promise<string> {
    const data = TestDataFactory.createSite(siteData);
    
    const response = await api.post('/sites', { data });
    expect(response.status()).toBe(201);
    
    const created = await response.json();
    expect(created.id).toBeTruthy();
    
    return created.id;
  }

  /**
   * Create a building and return its ID
   */
  static async createBuildingAndGetId(api: any, siteId: string, buildingData?: Partial<CreateBuildingRequest>): Promise<string> {
    const data = TestDataFactory.createBuilding(siteId, buildingData);
    
    // API expects site_id instead of siteId
    const apiData = {
      site_id: data.siteId,
      name: data.name,
      floors: data.floors
    };
    
    const response = await api.post('/buildings', { data: apiData });
    expect(response.status()).toBe(201);
    
    const created = await response.json();
    expect(created.id).toBeTruthy();
    
    return created.id;
  }



  /**
   * Cleanup site by ID (with error handling)
   */
  static async cleanupSite(api: any, siteId: string): Promise<void> {
    try {
      const response = await api.delete(`/sites/${siteId}`);
      if (response.status() !== 204 && response.status() !== 404) {
        console.warn(`Unexpected status ${response.status()} when deleting site ${siteId}`);
      }
    } catch (error) {
      console.log(`Site ${siteId} cleanup failed: ${error}`);
    }
  }

  /**
   * Cleanup building by ID
   */
  static async cleanupBuilding(api: any, buildingId: string): Promise<void> {
    try {
      const response = await api.delete(`/buildings/${buildingId}`);
      if (response.status() !== 204 && response.status() !== 404) {
        console.warn(`Unexpected status ${response.status()} when deleting building ${buildingId}`);
      }
    } catch (error) {
      console.log(`Building ${buildingId} cleanup failed: ${error}`);
    }
  }

  /**
   * Cleanup level by ID
   */
  static async cleanupLevel(api: any, levelId: string): Promise<void> {
    try {
      const response = await api.delete(`/levels/${levelId}`);
      if (response.status() !== 204 && response.status() !== 404) {
        console.warn(`Unexpected status ${response.status()} when deleting level ${levelId}`);
      }
    } catch (error) {
      console.log(`Level ${levelId} cleanup failed: ${error}`);
    }
  }

  /**
   * Wait for a condition to be met with timeout
   */
  static async waitForCondition(
    condition: () => Promise<boolean>, 
    timeout = 10000, 
    interval = 100
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    throw new Error(`Condition not met within ${timeout}ms timeout`);
  }

  /**
   * Verify site exists and return site data
   */
  static async verifySiteExists(api: any, siteId: string, expectedData?: Partial<Site>): Promise<Site> {
    const response = await api.get(`/sites/${siteId}`);
    expect(response.status()).toBe(200);
    
    const site = await response.json();
    expect(site.id).toBe(siteId);
    
    if (expectedData) {
      Object.keys(expectedData).forEach(key => {
        expect(site[key as keyof Site]).toBe(expectedData[key as keyof Site]);
      });
    }
    
    return site;
  }

  /**
   * Verify site does not exist
   */
  static async verifySiteNotExists(api: any, siteId: string): Promise<void> {
    const response = await api.get(`/sites/${siteId}`);
    expect(response.status()).toBe(404);
  }

  /**
   * Get all sites with optional pagination
   */
  static async getAllSites(api: any, page?: number, limit?: number): Promise<Site[]> {
    let url = '/sites';
    const params = new URLSearchParams();
    
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await api.get(url);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    
    // Handle both paginated and simple array responses
    if (Array.isArray(data)) {
      return data;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    
    throw new Error('Unexpected response format for sites list');
  }

  /**
   * Update site data
   */
  static async updateSite(api: any, siteId: string, updateData: Partial<Site>): Promise<Site> {
    const response = await api.put(`/sites/${siteId}`, { data: updateData });
    expect(response.status()).toBe(200);
    
    const updated = await response.json();
    expect(updated.id).toBe(siteId);
    
    return updated;
  }

  /**
   * Validate API response structure and status
   */
  static validateApiResponse(response: any, expectedStatus: number): void {
    expect(response.status()).toBe(expectedStatus);
    
    if (expectedStatus >= 200 && expectedStatus < 300) {
      const contentType = response.headers()['content-type'];
      if (contentType) {
        expect(contentType).toContain('application/json');
      }
    }
  }

  /**
   * Retry API call with exponential backoff
   */
  static async retryApiCall<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1} after ${delay}ms delay`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }

  /**
   * Add Allure attachment with API response details
   */
  static async addApiResponseAttachment(response: any, name: string): Promise<void> {
    try {
      const responseData = await response.json();
      await allure.attachment(
        name,
        JSON.stringify({
          status: response.status(),
          headers: response.headers(),
          body: responseData
        }, null, 2),
        'application/json'
      );
    } catch (error) {
      await allure.attachment(
        name,
        JSON.stringify({
          status: response.status(),
          headers: response.headers(),
          error: 'Could not parse response body'
        }, null, 2),
        'application/json'
      );
    }
  }

  /**
   * Verify API response contains expected fields
   */
  static verifyResponseStructure(responseData: any, expectedFields: string[]): void {
    expectedFields.forEach(field => {
      expect(responseData).toHaveProperty(field);
      expect(responseData[field]).toBeDefined();
    });
  }

  /**
   * Cleanup complete test hierarchy
   */
  static async cleanupTestHierarchy(api: any, hierarchy: {
    siteId?: string;
    buildingId?: string;
    levelId?: string;
  }): Promise<void> {
    // Cleanup in reverse order (levels -> buildings -> sites)
    if (hierarchy.levelId) {
      await this.cleanupLevel(api, hierarchy.levelId);
    }
    if (hierarchy.buildingId) {
      await this.cleanupBuilding(api, hierarchy.buildingId);
    }
    if (hierarchy.siteId) {
      await this.cleanupSite(api, hierarchy.siteId);
    }
  }
}
