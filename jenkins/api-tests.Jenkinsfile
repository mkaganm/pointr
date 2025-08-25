pipeline {
  agent any
  environment { DOCKER_BUILDKIT = '1' }

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/mkaganm/pointr.git', branch: 'master'
        sh 'pwd && ls -la'
        dir('pointr-api-tests') { sh 'echo ">> in $(pwd)"; ls -la' }
      }
    }

    stage('Run Docker Tests (compose: tests)') {
      steps {
        sh '''
          echo "🚀 Starting Docker tests..."
          docker compose -f pointr-api-tests/docker-compose.yml config --services || true
          docker compose -f pointr-api-tests/docker-compose.yml up --build tests
        '''
      }
      post {
        always {
          sh 'docker compose -f pointr-api-tests/docker-compose.yml down || true'
        }
      }
    }

    stage('Generate Allure Report') {
      steps {
        sh '''
          echo "📊 Generating Allure report..."
          rm -rf pointr-api-tests/allure-report || true
          mkdir -p pointr-api-tests/allure-report

          if [ -d "pointr-api-tests/allure-results" ] && [ "$(ls -A pointr-api-tests/allure-results || true)" ]; then
            docker run --rm \
              -v "$PWD/pointr-api-tests/allure-results:/results" \
              -v "$PWD/pointr-api-tests/allure-report:/report" \
              ghcr.io/allure-framework/allure2:2.29.0 \
              generate /results -o /report
          else
            echo "No allure-results found; skipping."
          fi
        '''
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'pointr-api-tests/allure-results/**,pointr-api-tests/allure-report/**', fingerprint: true, allowEmptyArchive: true
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
