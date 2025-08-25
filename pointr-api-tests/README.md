# Pointr API Tests

A comprehensive API testing suite built with Playwright, Allure reporting, and Docker support for the Pointr API.

## Overview

This project contains automated API tests for the Pointr system, covering:
- Site management
- Building operations  
- Level management
- Positive and negative test scenarios

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker (optional, for containerized testing)

## Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   npx playwright install --with-deps
   ```

2. **Configure environment:**
   ```bash
   cp env.example .env
   # Edit .env file with your API configuration
   export PLAYWRIGHT_BASE_URL=http://localhost:8080
   ```

3. **Run tests:**
   ```bash
   # Run all API tests
   npm run test:api
   
   # Run specific test groups
   npm run test:site
   npm run test:building
   npm run test:levels
   npm run test:negative
   ```

4. **Generate and view reports:**
   ```bash
   npm run report:allure
   npm run report:open
   ```

### Docker Setup

Run tests in a containerized environment:

```bash
docker compose up --build --abort-on-container-exit
```

## Test Structure

- `tests/api/` - API test files
  - `site.spec.ts` - Site management tests
  - `building.spec.ts` - Building operations tests
  - `levels.spec.ts` - Level management tests
  - `*-negative.spec.ts` - Negative test scenarios

## Available Scripts

- `npm run test:api` - Run all API tests
- `npm run test:all` - Run all tests
- `npm run test:with-report` - Run tests and generate report
- `npm run report:allure` - Generate Allure report
- `npm run report:open` - Open Allure report in browser
- `npm run report:clean` - Clean all report directories

## Reports

Test reports are generated in the `allure-report/` directory and can be viewed in any web browser. The reports include detailed test results, screenshots, and performance metrics.

## Docker Support

The project includes Docker configuration for:
- Isolated test execution
- CI/CD integration
- Consistent test environments

## Notes

- Each test creates its own data and validates through IDs
- Tests are independent and repeatable
- Update routes and data fields in tests if API endpoints change
