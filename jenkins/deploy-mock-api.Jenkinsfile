pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "pointr-mock:latest"
        COMPOSE_FILE = "docker-compose.yml"
    }

    parameters {
        string(name: 'BRANCH_NAME', defaultValue: 'master', description: 'Branch to build from')
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    git branch: params.BRANCH_NAME, url: 'https://github.com/mkaganm/pointr-mock.git'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                dir('pointr-mock') {
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
            }
        }
        stage('Deploy with Docker') {
            steps {
                script {
                    sh "docker rm -f pointr-mock || true"
                    sh "docker run -d --name pointr-mock -p 8081:8081 $DOCKER_IMAGE"
                }
            }
        }
    }
}
