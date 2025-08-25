# Jenkins CI/CD Pipeline

Jenkins pipelines for **Pointr** application testing and deployment.

## 📁 Project Structure

```
jenkins/
├── blog-tests.Jenkinsfile      # Frontend tests with Playwright
├── api-tests.Jenkinsfile       # API tests with Allure reporting
├── deploy-mock-api.Jenkinsfile # Mock API deployment
├── Dockerfile                  # Custom Jenkins container
└── README.md
```

## 🚀 Pipelines

### Blog Tests
- **Purpose**: Frontend testing with Playwright
- **Report**: HTML report served on port 8091
- **Repository**: `https://github.com/mkaganm/pointr.git`

### API Tests  
- **Purpose**: API endpoint testing with Allure
- **Report**: Allure HTML report in Jenkins UI
- **Repository**: `https://github.com/mkaganm/pointr.git`

### Mock API Deployment
- **Purpose**: Deploy mock API service
- **Port**: 8081
- **Features**: Parametric branch selection, auto-restart

## 🐳 Quick Start

```bash
# Build Jenkins container
docker build -t jenkins-pointr .

# Run Jenkins
docker run -d \
  --name jenkins-pointr \
  -p 8080:8080 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins-pointr
```

## 📊 Reports

- **Playwright**: `http://<agent-ip>:8091`
- **Allure**: Jenkins UI → "Allure-Report"

## 🔧 Usage

1. Access Jenkins: `http://localhost:8080`
2. Create new Pipeline
3. Select Jenkinsfile
4. Build

---

**Version**: 1.0.0
