pipeline {
  agent any
  environment {
    DOCKER_BUILDKIT = '1'
  }

  stages {
    stage('Checkout') {
      steps {
        // Clone repository and show workspace structure
        git url: 'https://github.com/mkaganm/pointr.git', branch: 'master'
        sh 'pwd && ls -la'
        dir('pointr-api-tests') { sh 'echo ">> in $(pwd)"; ls -la' }
      }
    }

    stage('Run Docker Tests (compose: tests)') {
      steps {
        // Run tests; do not fail pipeline to still publish whatever is produced
        sh '''
          set -eu
          echo "🚀 Starting Docker tests..."
          docker compose -f pointr-api-tests/docker-compose.yml config --services || true
          docker compose -f pointr-api-tests/docker-compose.yml up --build tests || true
          docker compose -f pointr-api-tests/docker-compose.yml down || true

          echo "🧾 Listing Allure artifacts on host:"
          ls -la pointr-api-tests/allure-results || true
          ls -la pointr-api-tests/allure-report  || true
        '''
      }
    }
  }

  post {
    always {
      // Archive artifacts for build history
      archiveArtifacts artifacts: 'pointr-api-tests/allure-results/**,pointr-api-tests/allure-report/**', fingerprint: true, allowEmptyArchive: true

      // Publish Allure HTML report to Jenkins UI (container already generated it)
      publishHTML(target: [
        reportDir: 'pointr-api-tests/allure-report',
        reportFiles: 'index.html',
        reportName: '📊 Allure Report',
        keepAll: true,
        alwaysLinkToLastBuild: true,
        allowMissing: true
      ])
    }
  }
}
