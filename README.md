# POINTR

A comprehensive test automation project that includes web automation tests, API tests, and CI/CD pipelines.

## 📁 Project Structure

```
pointr/
├── jenkins/                    # Jenkins CI/CD pipelines
├── pointr-mock/               # Go-based Mock API service
├── pointr-api-tests/          # API test automation
├── pointr-blog-tests/         # Blog web automation
└── documents/                 # Project documentation
```

## 🚀 Components

### 1. **Jenkins CI/CD** (`jenkins/`)
- **Blog Tests**: Frontend tests with Playwright
- **API Tests**: API endpoint tests with Allure reporting
- **Mock API Deployment**: Automated deployment of Mock API service
- **Port**: Jenkins UI (8080), Playwright reports (8091)

### 2. **Mock API** (`pointr-mock/`)
- **Technology**: Go + Fiber framework
- **Port**: 8081
- **Features**: Site, Building, Level management
- **Endpoints**: RESTful API (GET, POST, DELETE)
- **Database**: In-memory store

### 3. **API Tests** (`pointr-api-tests/`)
- **Technology**: Playwright + Allure
- **Scope**: Site, Building, Level operations
- **Test Types**: Positive and negative test scenarios
- **Reporting**: Allure HTML reports

### 4. **Blog Tests** (`pointr-blog-tests/`)
- **Technology**: Playwright + TypeScript
- **Target**: [Pointr Blog](https://www.pointr.tech/blog)
- **Features**: Blog post analysis, word frequency
- **Browsers**: Chrome and Firefox support

## 🐳 Quick Start

### Run Mock API
```bash
cd pointr-mock
make build
make run
```

### API Tests
```bash
cd pointr-api-tests
npm install
npm run test:api
```

### Blog Tests
```bash
cd pointr-blog-tests
npm install
npm test
```

### Jenkins Pipeline
```bash
cd jenkins
docker build -t jenkins-pointr .
docker run -d --name jenkins-pointr -p 8080:8080 jenkins-pointr
```

## 📊 Reports

- **Playwright**: `http://<agent-ip>:8091`
- **Allure**: Jenkins UI → "Allure-Report"
- **Blog Tests**: `playwright-report/` folder

## 🔧 API Endpoints

- **Sites**: `GET/POST /sites`, `GET/DELETE /sites/:id`
- **Buildings**: `GET/POST /buildings`, `GET/DELETE /buildings/:id`
- **Levels**: `GET/POST /levels`, `GET/DELETE /levels/:id`
- **Health**: `GET /health`

## 🧪 Test Features

- ✅ Cross-browser testing
- ✅ API endpoint validation
- ✅ Negative test scenarios
- ✅ Automated reporting
- ✅ Docker containerization
- ✅ CI/CD integration

## 🔌 Used Ports

| Port  | Service         |
|-------|-----------------|
| 8081  | Mock API        |
| 8080  | Jenkins         |
| 5050  | Allure Server   |
| 8090  | Report Service  |
| 8091  | Report Service  |