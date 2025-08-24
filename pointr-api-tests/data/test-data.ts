import { CreateSiteRequest, CreateBuildingRequest, CreateLevelRequest } from '../types';

export class TestDataFactory {
  private static counter = 1;
  private static timestamp = Date.now();

  /**
   * Create test site data
   */
  static createSite(overrides?: Partial<CreateSiteRequest>): CreateSiteRequest {
    return {
      name: `Test Site ${this.counter++}`,
      location: `Test Location ${this.counter}`,
      ...overrides
    };
  }

  /**
   * Create test building data
   */
  static createBuilding(siteId: string, overrides?: Partial<CreateBuildingRequest>): CreateBuildingRequest {
    return {
      name: `Test Building ${this.counter++}`,
      siteId,
      floors: Math.floor(Math.random() * 20) + 1, // 1-20 floors
      ...overrides
    };
  }



  /**
   * Create edge case test data
   */
  static createEdgeCaseSiteData(): CreateSiteRequest[] {
    return [
      { name: 'A', location: 'B' }, // Minimal data
      { name: 'Site with spaces', location: 'Location with spaces' }, // Spaces
      { name: 'Site-With-Dashes', location: 'Location-With-Dashes' }, // Dashes
      { name: 'Site_With_Underscores', location: 'Location_With_Underscores' }, // Underscores
      { name: 'Site123', location: 'Location123' }, // Numbers
      { name: 'Site with Special Chars', location: 'Location with Special Chars' }, // Special characters
      { name: 'UPPERCASE SITE', location: 'UPPERCASE LOCATION' }, // Uppercase
      { name: 'lowercase site', location: 'lowercase location' }, // Lowercase
      { name: 'MiXeD cAsE sItE', location: 'MiXeD cAsE lOcAtIoN' } // Mixed case
    ];
  }

  /**
   * Generate random test data with realistic values
   */
  static createRealisticSiteData(): CreateSiteRequest {
    const siteNames = [
      'Central Hospital', 'City Medical Center', 'Regional Clinic',
      'University Hospital', 'Private Medical Center', 'Community Health Center',
      'Emergency Hospital', 'Pediatric Clinic', 'Surgical Center', 'Rehabilitation Center'
    ];
    
    const locations = [
      'Istanbul, Turkey', 'Ankara, Turkey', 'Izmir, Turkey',
      'Bursa, Turkey', 'Antalya, Turkey', 'Adana, Turkey',
      'Gaziantep, Turkey', 'Konya, Turkey', 'Mersin, Turkey', 'Diyarbakır, Turkey'
    ];

    return {
      name: siteNames[Math.floor(Math.random() * siteNames.length)],
      location: locations[Math.floor(Math.random() * locations.length)]
    };
  }


}
