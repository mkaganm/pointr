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
        // Run tests via docker-compose; do not fail pipeline immediately
        sh '''
          set -euxo pipefail
          echo "🚀 Starting Docker tests..."
          docker compose -f pointr-api-tests/docker-compose.yml config --services || true
          docker compose -f pointr-api-tests/docker-compose.yml up --build tests || true
        '''
      }
      post {
        always {
          // Try to copy allure-results directory from the test container to workspace
          sh '''
            set +e
            echo "🔎 Resolving tests container id..."
            CID="$(docker compose -f pointr-api-tests/docker-compose.yml ps -q tests 2>/dev/null)"
            echo "CID=$CID"
            mkdir -p pointr-api-tests/allure-results

            if [ -n "$CID" ]; then
              echo "🗂  Searching allure-results inside container..."
              FIND_CMD='for P in \
                /work/allure-results \
                /app/allure-results \
                /tests/allure-results \
                /usr/src/app/allure-results \
                /home/pwuser/allure-results \
                /allure-results \
                /tmp/allure-results; do \
                  if [ -d "$P" ] && [ "$(ls -A "$P" 2>/dev/null)" ]; then echo "$P"; fi; \
                done | head -n1'
              SRC_DIR=$(docker exec "$CID" sh -lc "$FIND_CMD")
              echo "Detected SRC_DIR=$SRC_DIR"

              if [ -n "$SRC_DIR" ]; then
                echo "📦 Copying results from $SRC_DIR ..."
                docker cp "$CID:$SRC_DIR/." "pointr-api-tests/allure-results/"
                echo "✅ Copied allure-results to workspace."
              else
                echo "⚠️  No non-empty allure-results dir found in container."
              fi
            else
              echo "⚠️  Could not resolve container id for tests service."
            fi
          '''
          // Shut down compose services to clean up
          sh 'docker compose -f pointr-api-tests/docker-compose.yml down || true'
        }
      }
    }

    stage('Generate Allure Report (host)') {
      steps {
        // Generate Allure report on Jenkins host using official Allure docker image
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
            echo "❌ No allure-results found; skipping generate."
          fi
        '''
      }
    }
  }

  post {
    always {
      // Archive artifacts so they are kept in Jenkins build history
      archiveArtifacts artifacts: 'pointr-api-tests/allure-results/**,pointr-api-tests/allure-report/**', fingerprint: true, allowEmptyArchive: true

      // Publish Allure HTML report to Jenkins UI
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
