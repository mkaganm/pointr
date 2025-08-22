pipeline {
  agent any

  // Windows + Docker Desktop için; Linux'ta gerekmez.
  environment {
    DOCKER_HOST = "tcp://host.docker.internal:2375"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build pointr-mock') {
      when { expression { fileExists('pointr-mock/Dockerfile') } }
      steps {
        dir('pointr-mock') {
          sh 'docker build -t myorg/pointr-mock:latest .'
        }
      }
    }

    stage('Deploy pointr-mock') {
      when { expression { fileExists('pointr-mock') } }
      steps {
        dir('pointr-mock') {
          script {
            if (fileExists('deploy/docker-compose.yml')) {
              sh 'docker compose -f deploy/docker-compose.yml up -d --remove-orphans'
            } else {
              sh '''
                docker rm -f pointr-mock || true
                docker run -d --name pointr-mock -p 8081:8081 myorg/pointr-mock:latest
              '''
            }
          }
        }
      }
    }

    stage('Build pointr-admin') {
      when { expression { fileExists('pointr-admin/Dockerfile') } }
      steps {
        dir('pointr-admin') {
          sh 'docker build -t myorg/pointr-admin:latest .'
        }
      }
    }

    stage('Build pointr-api') {
      when { expression { fileExists('pointr-api/Dockerfile') } }
      steps {
        dir('pointr-api') {
          sh 'docker build -t myorg/pointr-api:latest .'
        }
      }
    }
  }
}
