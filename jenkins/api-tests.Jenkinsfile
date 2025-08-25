pipeline {
  agent any

  environment {
    DOCKER_BUILDKIT = '1'
  }

  stages {
    stage('Checkout') {
      steps {
        // Clone the repo and list the test folder
        git url: 'https://github.com/mkaganm/pointr.git', branch: 'master'
        dir('pointr/pointr-api-tests') {
          sh 'pwd && ls -la'
        }
      }
    }

    stage('Run Docker Tests') {
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

    stage('Generate Allure Report') {
      steps {
        dir('pointr/pointr-api-tests') {
          sh '''
            echo "📊 Generating Allure report..."
            npx -y allure-commandline@latest generate allure-results --clean -o allure-report
          '''
        }
      }
    }

    stage('Serve Report on :8090') {
      steps {
        dir('pointr/pointr-api-tests') {
          sh '''
            echo "🔎 Freeing port 8090 if in use..."
            (command -v fuser >/dev/null 2>&1 && fuser -k 8090/tcp) \
              || (command -v lsof  >/dev/null 2>&1 && lsof -ti:8090 | xargs -r kill -9) \
              || true

            echo "🌐 Starting Python server on port 8090..."
            (python3 -V >/dev/null 2>&1 && nohup python3 -m http.server 8090 -d allure-report >server.log 2>&1 &) \
              || (python  -V >/dev/null 2>&1 && nohup python  -m http.server 8090 -d allure-report >server.log 2>&1 &) \
              || (cd allure-report && nohup python3 -m http.server 8090 >server.log 2>&1 &)

            echo "📱 Open http://localhost:8090 in your browser"
          '''
        }
      }
    }
  }

  post {
    always {
      dir('pointr/pointr-api-tests') {
        archiveArtifacts artifacts: 'allure-report/**', fingerprint: true
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
