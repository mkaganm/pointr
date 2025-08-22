pipeline {
  agent any

  environment {
    // Needed on Windows + Docker Desktop; remove if Linux host
    DOCKER_HOST = "tcp://host.docker.internal:2375"
  }

  stages {
    stage('Clean') {
      steps {
        sh '''
          echo "Cleaning old containers and images..."

          docker rm -f pointr-mock || true
          docker rmi -f myorg/pointr-mock:latest || true

          docker image prune -f || true
        '''
      }
    }

    stage('Build') {
      steps {
        dir('pointr-mock') {
          sh '''
            echo "Building Docker image..."
            docker build \
              -t myorg/pointr-mock:${BUILD_NUMBER} \
              -t myorg/pointr-mock:latest \
              .
          '''
        }
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          echo "Deploying container..."
          docker run -d --name pointr-mock \
            --restart=always \
            -p 8081:8081 \
            myorg/pointr-mock:${BUILD_NUMBER}
        '''
      }
    }
  }
}
