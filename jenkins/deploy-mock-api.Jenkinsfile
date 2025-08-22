pipeline {
  agent any

  parameters {
    // Branch adını elle girmek için serbest text parametresi
    string(name: 'BRANCH', defaultValue: 'master', description: 'Enter the branch to build')
  }

  options {
    skipDefaultCheckout()
  }

  environment {
    // Windows + Docker Desktop için gerekebilir; Linux'ta kaldırabilirsin
    DOCKER_HOST = "tcp://host.docker.internal:2375"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout([$class: 'GitSCM',
          branches: [[name: "*/${params.BRANCH}"]],
          userRemoteConfigs: [[url: 'https://github.com/mkaganm/pointr.git']]
        ])
      }
    }

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
