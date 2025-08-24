import { allure } from 'allure-playwright';

export class AllureHelpers {
  /**
   * Log message to both console and Allure step
   * @param message - Message to log
   * @param level - Log level (info, warn, error, debug)
   * @param data - Optional data to include in Allure attachment
   */
  static async logStep(
    message: string, 
    level: 'info' | 'warn' | 'error' | 'debug' = 'info',
    data?: any
  ): Promise<void> {
    // Console logging with timestamp and level
    const timestamp = new Date().toISOString();
    const consoleMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    switch (level) {
      case 'error':
        console.error(consoleMessage);
        break;
      case 'warn':
        console.warn(consoleMessage);
        break;
      case 'debug':
        console.debug(consoleMessage);
        break;
      default:
        console.log(consoleMessage);
    }

    // Allure step logging
    await allure.step(`Log [${level.toUpperCase()}]: ${message}`, async () => {
      if (data) {
        await allure.attachment(
          'Additional Data',
          JSON.stringify(data, null, 2),
          'application/json'
        );
      }
    });
  }

  /**
   * Log API call details to both console and Allure
   * @param method - HTTP method
   * @param url - API endpoint
   * @param statusCode - Response status code
   * @param responseTime - Response time in milliseconds
   * @param requestData - Request payload (optional)
   * @param responseData - Response data (optional)
   */
  static async logApiCall(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    requestData?: any,
    responseData?: any
  ): Promise<void> {
    const statusColor = statusCode >= 200 && statusCode < 300 ? '✅' : '❌';
    const message = `${statusColor} ${method} ${url} - ${statusCode} (${responseTime}ms)`;
    
    // Console logging
    console.log(message);
    
    // Allure step with detailed information
    await allure.step(`API Call: ${method} ${url}`, async () => {
      await allure.attachment(
        'API Call Summary',
        JSON.stringify({
          method,
          url,
          statusCode,
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString()
        }, null, 2),
        'application/json'
      );

      if (requestData) {
        await allure.attachment(
          'Request Data',
          JSON.stringify(requestData, null, 2),
          'application/json'
        );
      }

      if (responseData) {
        await allure.attachment(
          'Response Data',
          JSON.stringify(responseData, null, 2),
          'application/json'
        );
      }
    });
  }

  /**
   * Log test assertion results to both console and Allure
   * @param expected - Expected value
   * @param actual - Actual value
   * @param assertionType - Type of assertion (toBe, toContain, etc.)
   * @param success - Whether assertion passed
   */
  static async logAssertion(
    expected: any,
    actual: any,
    assertionType: string,
    success: boolean
  ): Promise<void> {
    const status = success ? '✅ PASS' : '❌ FAIL';
    const message = `${status} Assertion: Expected ${assertionType} ${JSON.stringify(expected)}, Actual: ${JSON.stringify(actual)}`;
    
    // Console logging
    console.log(message);
    
    // Allure step
    await allure.step(`Assertion: ${assertionType}`, async () => {
      await allure.attachment(
        'Assertion Details',
        JSON.stringify({
          type: assertionType,
          expected,
          actual,
          success,
          timestamp: new Date().toISOString()
        }, null, 2),
        'application/json'
      );
    });
  }

  /**
   * Log test step with both console and Allure
   * @param stepName - Name of the step
   * @param stepFunction - Function to execute
   * @param addTimestamp - Whether to add timestamp
   */
  static async logStepWithConsole(
    stepName: string,
    stepFunction: () => Promise<void>,
    addTimestamp: boolean = true
  ): Promise<void> {
    const timestamp = addTimestamp ? ` [${new Date().toISOString()}]` : '';
    const fullStepName = `${stepName}${timestamp}`;
    
    // Console logging
    console.log(`🔄 ${fullStepName}`);
    
    // Allure step
    await allure.step(fullStepName, stepFunction);
    
    // Console logging after step completion
    console.log(`✅ ${stepName} completed`);
  }

  /**
   * Add API request and response to Allure
   */
  static async addApiRequestResponse(
    requestData: any, 
    responseData: any, 
    statusCode: number,
    endpoint: string
  ): Promise<void> {
    await allure.attachment(
      `${endpoint} - Request`, 
      JSON.stringify(requestData, null, 2), 
      'application/json'
    );
    
    await allure.attachment(
      `${endpoint} - Response (${statusCode})`, 
      JSON.stringify(responseData, null, 2), 
      'application/json'
    );
  }

  /**
   * Add detailed API call information in collapsible HTML format
   */
  static async addApiCallDetails(
    method: string,
    url: string,
    requestData: any,
    responseData: any,
    statusCode: number,
    responseTime: number
  ): Promise<void> {
    const htmlContent = `
      <details class="api-call">
        <summary style="cursor: pointer; padding: 8px; background: #f5f5f5; border: 1px solid #ddd; margin: 5px 0;">
          <strong style="color: #0066cc;">${method}</strong>
          <span style="margin-left: 10px; color: #333;">${url}</span>
          <span style="margin-left: 10px; color: ${statusCode >= 200 && statusCode < 300 ? '#28a745' : '#dc3545'};">${statusCode}</span>
          <span style="margin-left: 10px; color: #666;">${responseTime}ms</span>
        </summary>
        
        <div style="padding: 15px; border: 1px solid #ddd; border-top: none; background: #fafafa;">
          <div style="margin-bottom: 15px;">
            <h4 style="margin: 0 0 8px 0; color: #333;">Request:</h4>
            <pre style="background: #fff; padding: 10px; border: 1px solid #e0e0e0; border-radius: 4px; overflow-x: auto; margin: 0;">${JSON.stringify(requestData, null, 2)}</pre>
          </div>
          
          <div>
            <h4 style="margin: 0 0 8px 0; color: #333;">Response:</h4>
            <pre style="background: #fff; padding: 10px; border: 1px solid #e0e0e0; border-radius: 4px; overflow-x: auto; margin: 0;">${JSON.stringify(responseData, null, 2)}</pre>
          </div>
        </div>
      </details>
    `;

    await allure.attachment(
      `${method} ${url} (${statusCode})`,
      htmlContent,
      'text/html'
    );
  }

  /**
   * Set test metadata
   */
  static async setTestMetadata(
    epic: string,
    feature: string,
    story: string,
    severity: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial' = 'normal',
    owner: string = 'QA Team',
    tags: string[] = []
  ): Promise<void> {
    await allure.epic(epic);
    await allure.feature(feature);
    await allure.story(story);
    await allure.severity(severity);
    await allure.owner(owner);
    
    for (const tag of tags) {
      await allure.tag(tag);
    }
  }

  /**
   * Add test description and links
   */
  static async addTestInfo(
    description: string,
    documentationUrl?: string,
    issueId?: string,
    issueTitle?: string
  ): Promise<void> {
    await allure.description(description);
    
    if (documentationUrl) {
      await allure.link('Documentation', documentationUrl);
    }
    
    if (issueId && issueTitle) {
      await allure.issue(issueId, issueTitle);
    }
  }

  /**
   * Add environment information
   */
  static async addEnvironmentInfo(
    baseUrl: string,
    environment: string = 'test'
  ): Promise<void> {
    await allure.attachment(
      'Environment Info',
      JSON.stringify({
        baseUrl,
        environment,
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        platform: process.platform
      }, null, 2),
      'application/json'
    );
  }

  /**
   * Make test step more detailed
   */
  static async detailedStep(
    stepName: string,
    stepFunction: () => Promise<void>,
    addTimestamp: boolean = true
  ): Promise<void> {
    const timestamp = addTimestamp ? ` [${new Date().toISOString()}]` : '';
    await allure.step(`${stepName}${timestamp}`, stepFunction);
  }

  /**
   * Add screenshot in case of error
   */
  static async addErrorScreenshot(page: any, errorMessage: string): Promise<void> {
    try {
      const screenshot = await page.screenshot({ fullPage: true });
      await allure.attachment(
        `Error Screenshot - ${errorMessage}`,
        screenshot,
        'image/png'
      );
    } catch (error) {
      console.warn('Screenshot could not be taken:', error);
    }
  }

  /**
   * Add performance metrics
   */
  static async addPerformanceMetrics(
    operationName: string,
    duration: number,
    additionalMetrics?: Record<string, any>
  ): Promise<void> {
    const metrics = {
      operation: operationName,
      duration_ms: duration,
      timestamp: new Date().toISOString(),
      ...additionalMetrics
    };
    
    await allure.attachment(
      `Performance - ${operationName}`,
      JSON.stringify(metrics, null, 2),
      'application/json'
    );
  }
}
