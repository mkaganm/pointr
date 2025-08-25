pipeline {
  agent any

  stages {
    stage("Checkout") {
      steps {
        git url: "https://github.com/mkaganm/pointr.git", branch: "master"
        dir("pointr-blog-tests") { sh "pwd && ls -la" }
      }
    }

    stage("List compose services") {
      steps {
        sh '''
          docker compose -f pointr-blog-tests/docker-compose.yml config --services | tee services.txt
          echo "Services:"
          cat services.txt
        '''
      }
    }

    stage("Run Playwright tests via docker-compose") {
      steps {
        sh '''
          echo "🚀 Running tests with docker-compose..."
          if grep -qx "tests" services.txt 2>/dev/null; then
            TARGET=tests
          else
            # fallback: pick a likely test service name
            TARGET=$(grep -E 'test|playwright|e2e' services.txt | head -n1 || true)
          fi

          if [ -n "$TARGET" ]; then
            docker compose -f pointr-blog-tests/docker-compose.yml up --build --exit-code-from "$TARGET" "$TARGET"
          else
            # no explicit test service -> bring full stack (not ideal, but works)
            docker compose -f pointr-blog-tests/docker-compose.yml up --build
          fi
        '''
      }
      post {
        always {
          sh 'docker compose -f pointr-blog-tests/docker-compose.yml down || true'
        }
      }
    }

    stage("Publish Playwright HTML report") {
      steps {
        sh '''
          # Expect report to be written under host folder via compose volumes:
          if [ -f pointr-blog-tests/playwright-report/index.html ]; then
            echo "Report found."
          else
            echo "No playwright-report on host; skipping serve (compose may not have mounted it)."
            mkdir -p pointr-blog-tests/playwright-report || true
          fi
        '''
      }
    }

    stage("Serve report on :8091") {
      steps {
        dir('pointr-blog-tests') {
          sh '''
            if [ -f playwright-report/index.html ]; then
              echo "🔎 Freeing :8091 if busy..."
              (command -v fuser >/dev/null 2>&1 && fuser -k 8091/tcp) \
                || (command -v lsof >/dev/null 2>&1 && lsof -ti:8091 | xargs -r kill -9) \
                || true

              echo "🌐 Starting http.server on 8091..."
              (python3 -V >/dev/null 2>&1 && nohup python3 -m http.server 8091 -d playwright-report >server-8091.log 2>&1 &) \
                || (python  -V >/dev/null 2>&1 && nohup python  -m http.server 8091 -d playwright-report >server-8091.log 2>&1 &) \
                || (cd playwright-report && nohup python3 -m http.server 8091 >../server-8091.log 2>&1 &)

              echo "📱 Open http://<agent-ip>:8091"
            else
              echo "No playwright-report/index.html; skipping serve."
            fi
          '''
        }
      }
    }
  }

  post {
    always {
      dir('pointr-blog-tests') {
        archiveArtifacts artifacts: 'playwright-report/**,server-8091.log', fingerprint: true, allowEmptyArchive: true
        publishHTML(target: [
          reportDir: 'playwright-report',
          reportFiles: 'index.html',
          reportName: 'Playwright Report (served on :8091)',
          keepAll: true,
          alwaysLinkToLastBuild: true,
          allowMissing: true
        ])
      }
    }
  }
}
