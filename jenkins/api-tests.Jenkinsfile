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
        // Run tests; do not fail pipeline so we can still publish the report
        sh '''
          set -eu
          echo "🚀 Starting Docker tests..."
          docker compose -f pointr-api-tests/docker-compose.yml config --services || true
          docker compose -f pointr-api-tests/docker-compose.yml up --build tests || true
          docker compose -f pointr-api-tests/docker-compose.yml down || true

          echo "🧾 Host-side allure-results listing:"
          ls -la pointr-api-tests/allure-results || true
        '''
      }
    }
  }

  post {
    always {
      // ALWAYS generate Allure report on host from allure-results
      sh '''
        set -e
        echo "📊 Generating Allure report on host..."
        rm -rf pointr-api-tests/allure-report || true
        mkdir -p pointr-api-tests/allure-report

        if [ -d "pointr-api-tests/allure-results" ] && [ "$(ls -A pointr-api-tests/allure-results || true)" ]; then
          docker run --rm \
            -v "$PWD/pointr-api-tests/allure-results:/results" \
            -v "$PWD/pointr-api-tests/allure-report:/report" \
            ghcr.io/allure-framework/allure2:2.29.0 \
            generate /results -o /report
          echo "✅ Allure report generated."
        else
          echo "❌ No allure-results found; Allure HTML cannot be generated."
        fi

        echo "📂 Final report dir:"
        ls -la pointr-api-tests/allure-report || true
      '''

      // Archive artifacts (allow empty so pipeline doesn't fail)
      archiveArtifacts artifacts: 'pointr-api-tests/allure-results/**,pointr-api-tests/allure-report/**', fingerprint: true, allowEmptyArchive: true

      // Publish Allure HTML report to Jenkins UI (no spaces in name)
      publishHTML(target: [
        reportDir: 'pointr-api-tests/allure-report',
        reportFiles: 'index.html',
        reportName: 'Allure-Report',
        keepAll: true,
        alwaysLinkToLastBuild: true,
        allowMissing: true
      ])

      // Print a direct link (no spaces now)
      script {
        def base = env.JENKINS_URL ?: 'http://localhost:8080/'
        def url  = "${base}job/${env.JOB_NAME}/${env.BUILD_NUMBER}/Allure-Report/"
        echo "📎 Allure Report URL: ${url}"
      }
    }
  }
}
