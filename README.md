# POINTR

A comprehensive test automation project that includes web automation tests, API tests, and CI/CD pipelines. All major components are fully dockerized for easy setup and reproducible results.

## 📁 Project Structure

```
pointr/
├── jenkins/                    # Jenkins CI/CD pipelines
├── pointr-mock/               # Go-based Mock API service
├── pointr-api-tests/          # API test automation
├── pointr-blog-tests/         # Blog web automation
└── documents/                 # Project documentation
```

## Components

### 1. **Jenkins CI/CD** (`jenkins/`)

#### [Jenkins files and document](https://github.com/mkaganm/pointr/tree/master/jenkins)

- **Blog Tests**: Frontend tests (run in Docker)
- **API Tests**: API endpoint tests (run in Docker)
- **Mock API Deployment**: Automated deployment of Mock API service (run in Docker)
- **Jenkins Server**: CI/CD pipelines managed and executed in Docker

![](https://github.com/mkaganm/pointr/blob/master/documents/Screenshot%202025-08-26%20005724.png)
![](https://github.com/mkaganm/pointr/blob/master/documents/Screenshot%202025-08-26%20005734.png)

### 2. **Mock API** (`pointr-mock/`)

#### [Mock API files and Document](https://github.com/mkaganm/pointr/tree/master/pointr-mock)
- **Technology**: Go + Fiber framework
- **Port**: 8081
- **Features**: Site, Building, Level management
- **Endpoints**: RESTful API (GET, POST, DELETE)
- **Database**: In-memory store
- **Deployment**: Runs inside a Docker container

### 3. **API Tests** (`pointr-api-tests/`)
#### [API Tests and Document](https://github.com/mkaganm/pointr/tree/master/pointr-api-tests)
- **Technology**: Playwright + Allure
- **Scope**: Site, Building, Level operations
- **Test Types**: Positive and negative test scenarios
- **Reporting**: Allure HTML reports (served from Docker)
- **Execution**: All tests run in Docker containers

![](https://github.com/mkaganm/pointr/blob/master/documents/Screenshot%202025-08-26%20003416.png)
![](https://github.com/mkaganm/pointr/blob/master/documents/Screenshot%202025-08-26%20003450.png)
![](https://github.com/mkaganm/pointr/blob/master/documents/Screenshot%202025-08-26%20003501.png)
![](https://github.com/mkaganm/pointr/blob/master/documents/Screenshot%202025-08-26%20003510.png)
![](https://github.com/mkaganm/pointr/blob/master/documents/Screenshot%202025-08-26%20003703.png)


### 4. **Blog Tests** (`pointr-blog-tests/`)
#### [Blog Tests and Document](https://github.com/mkaganm/pointr/tree/master/pointr-blog-tests)
- **Technology**: Playwright + TypeScript
- **Target**: [Pointr Blog](https://www.pointr.tech/blog)
- **Features**: Blog post analysis, word frequency
- **Browsers**: Chrome and Firefox support
- **Execution**: All tests run in Docker containers

![](https://github.com/mkaganm/pointr/blob/master/documents/Screenshot%202025-08-26%20005327.png)
![](https://github.com/mkaganm/pointr/blob/master/documents/Screenshot%202025-08-26%20005359.png)
![](https://github.com/mkaganm/pointr/blob/master/documents/Screenshot%202025-08-26%20005423.png)


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
