pipeline {
  agent any
  environment {
    DOCKER_BUILDKIT = '1'
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/mkaganm/pointr.git', branch: 'master'
        dir('pointr/pointr-api-tests') { sh 'pwd && ls -la' }
      }
    }

    stage('Run Docker Tests (compose: tests)') {
      steps {
        dir('pointr/pointr-api-tests') {
          sh '''
            echo "🚀 Starting Docker tests..."
            docker compose up --build tests
          '''
        }
      }
      post {
        always {
          dir('pointr/pointr-api-tests') {
            sh 'docker compose down || true'
          }
        }
      }
    }

    stage('Publish Allure Report') {
      steps {
        dir('pointr/pointr-api-tests') {
          sh '''
            echo "📊 Checking allure-report folder..."
            test -d allure-report || { echo "allure-report not found (tests may have failed)."; mkdir -p allure-report; }
          '''
        }
      }
    }

    stage('Serve on :8090') {
      steps {
        dir('pointr/pointr-api-tests') {
          sh '''
            echo "🔎 Freeing port 8090 if in use..."
            (command -v fuser >/dev/null 2>&1 && fuser -k 8090/tcp) \
              || (command -v lsof >/dev/null 2>&1 && lsof -ti:8090 | xargs -r kill -9) \
              || true

            echo "🌐 Starting Python HTTP server on 8090..."
            (python3 -V >/dev/null 2>&1 && nohup python3 -m http.server 8090 -d allure-report >server.log 2>&1 &) \
              || (python -V  >/dev/null 2>&1 && nohup python  -m http.server 8090 -d allure-report >server.log 2>&1 &) \
              || (cd allure-report && nohup python3 -m http.server 8090 >../server.log 2>&1 &)

            echo "📱 Open http://<agent-ip>:8090"
          '''
        }
      }
    }
  }

  post {
    always {
      dir('pointr/pointr-api-tests') {
        archiveArtifacts artifacts: 'allure-results/**,allure-report/**,server.log', fingerprint: true, allowEmptyArchive: true
        publishHTML(target: [
          reportDir: 'allure-report',
          reportFiles: 'index.html',
          reportName: 'Allure Report (served on :8090)',
          keepAll: true,
          alwaysLinkToLastBuild: true,
          allowMissing: true
        ])
      }
    }
  }
}
