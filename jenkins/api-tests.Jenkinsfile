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
        // Run tests; do not fail pipeline so we can still publish any produced report
        sh '''
          set -eu
          echo "🚀 Starting Docker tests..."
          docker compose -f pointr-api-tests/docker-compose.yml config --services || true
          docker compose -f pointr-api-tests/docker-compose.yml up --build tests || true
          docker compose -f pointr-api-tests/docker-compose.yml down || true

          echo "🧾 Listing Allure artifacts on host (after compose):"
          ls -la pointr-api-tests/allure-results || true
          ls -la pointr-api-tests/allure-report  || true
        '''
      }
    }
  }

  post {
    always {
      // If the container didn't populate the host's allure-report, try generating on host from allure-results.
      sh '''
        set -e
        echo "🔧 Ensuring Allure HTML report exists on host..."
        if [ ! -f "pointr-api-tests/allure-report/index.html" ]; then
          if [ -d "pointr-api-tests/allure-results" ] && [ "$(ls -A pointr-api-tests/allure-results || true)" ]; then
            echo "📊 Generating Allure report on host from allure-results..."
            rm -rf pointr-api-tests/allure-report || true
            mkdir -p pointr-api-tests/allure-report
            docker run --rm \
              -v "$PWD/pointr-api-tests/allure-results:/results" \
              -v "$PWD/pointr-api-tests/allure-report:/report" \
              ghcr.io/allure-framework/allure2:2.29.0 \
              generate /results -o /report
          else
            echo "⚠️  No allure-results found; cannot generate host-side report."
          fi
        else
          echo "✅ Allure report already present on host."
        fi

        echo "📂 Final host-side listing:"
        ls -la pointr-api-tests/allure-report || true
      '''

      // Archive artifacts for build history (allow empty so pipeline doesn't fail)
      archiveArtifacts artifacts: 'pointr-api-tests/allure-results/**,pointr-api-tests/allure-report/**', fingerprint: true, allowEmptyArchive: true

      // Publish Allure HTML report to Jenkins UI
      publishHTML(target: [
        reportDir: 'pointr-api-tests/allure-report',
        reportFiles: 'index.html',
        // Use a simple ASCII name so the URL is stable and predictable
        reportName: 'Allure Report',
        keepAll: true,
        alwaysLinkToLastBuild: true,
        allowMissing: true
      ])

      // Print a direct, clickable link to the report at the end of the console log
      script {
        // Prefer configured JENKINS_URL; fall back to local default
        def base = env.JENKINS_URL ?: 'http://localhost:8080/'
        // URL-encode the report name to be safe (spaces -> %20, not +)
        def encName = java.net.URLEncoder.encode('Allure Report', 'UTF-8').replace('+', '%20')
        def url = "${base}job/${env.JOB_NAME}/${env.BUILD_NUMBER}/${encName}/"
        echo "📎 Allure Report URL: ${url}"
      }
    }
  }
}
