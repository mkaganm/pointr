pipeline {
  agent any
  options { timestamps() }

  environment {
    // Enable BuildKit for faster/more reliable Docker builds (optional but recommended)
    DOCKER_BUILDKIT = '1'
  }

  stages {
    stage('Checkout') {
      steps {
        // Clone the repo and show basic listing for sanity
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
          // Always tear down containers even if tests fail
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
            echo "🔎 Checking and freeing port 8090 if in use..."
            (command -v fuser >/dev/null 2>&1 && fuser -k 8090/tcp) \
              || (command -v lsof >/dev/null 2>&1 && lsof -ti:8090 | xargs -r kill -9) \
              || true

            echo "🌐 Starting Python server on port 8090..."
            # Prefer python3; fall back to python if needed
            (python3 -V >/dev/null 2>&1 && nohup python3 -m http.server 8090 -d allure-report >/dev/null 2>&1 &) \
              || (python -V >/dev/null 2>&1 && nohup python -m http.server 8090 -d allure-report >/dev/null 2>&1 &) \
              || (cd allure-report && nohup python3 -m http.server 8090 >/dev/null 2>&1 &)

            echo "📱 Open http://localhost:8090 in your browser"
          '''
        }
      }
    }
  }

  post {
    always {
      // Archive the generated report and publish as a Jenkins HTML report
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
