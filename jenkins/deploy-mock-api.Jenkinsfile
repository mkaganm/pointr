pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build pointr-mock') {
      steps {
        dir('pointr-mock') {
          sh 'docker build -t myorg/pointr-mock:latest .'
        }
      }
    }

    stage('Build pointr-admin') {
      steps {
        dir('pointr-admin') {
          sh 'docker build -t myorg/pointr-admin:latest .'
        }
      }
    }

    stage('Build pointr-api') {
      steps {
        dir('pointr-api') {
          sh 'docker build -t myorg/pointr-api:latest .'
        }
      }
    }
  }
}
