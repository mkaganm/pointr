pipeline {
  agent any
  environment {
    DOCKER_BUILDKIT = '1'
  }

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

    stage('Publish Allure Report') {
      steps {
        sh '''
          echo "📊 Checking allure-report folder..."
          test -d pointr-api-tests/allure-report || { echo "allure-report not found; creating empty dir for publisher"; mkdir -p pointr-api-tests/allure-report; }
        '''
      }
    }

    stage('Serve on :8090') {
      steps {
        sh '''
          if [ -f pointr-api-tests/allure-report/index.html ]; then
            echo "🔎 Freeing port 8090 if in use..."
            (command -v fuser >/dev/null 2>&1 && fuser -k 8090/tcp) \
              || (command -v lsof >/dev/null 2>&1 && lsof -ti:8090 | xargs -r kill -9) \
              || true

            echo "🌐 Starting Python HTTP server on 8090..."
            (python3 -V >/dev/null 2>&1 && nohup python3 -m http.server 8090 -d pointr-api-tests/allure-report >pointr-api-tests/server.log 2>&1 &) \
              || (python  -V >/dev/null 2>&1 && nohup python  -m http.server 8090 -d pointr-api-tests/allure-report >pointr-api-tests/server.log 2>&1 &) \
              || (cd pointr-api-tests/allure-report && nohup python3 -m http.server 8090 >../server.log 2>&1 &)

            echo "📱 Open http://<agent-ip>:8090"
          else
            echo "No allure-report/index.html; skipping serve."
          fi
        '''
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'pointr-api-tests/allure-results/**,pointr-api-tests/allure-report/**,pointr-api-tests/server.log', fingerprint: true, allowEmptyArchive: true
      publishHTML(target: [
        reportDir: 'pointr-api-tests/allure-report',
        reportFiles: 'index.html',
        reportName: 'Allure Report (served on :8090)',
        keepAll: true,
        alwaysLinkToLastBuild: true,
        allowMissing: true
      ])
    }
  }
}
