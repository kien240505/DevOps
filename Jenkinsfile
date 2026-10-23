pipeline {
  agent any

  stages {
    stage('Build images') {
    steps {
      bat 'docker compose build'
    }
}

    stage('Deploy') {
      when {
        branch 'main'
      }
      steps {
        withCredentials([file(credentialsId: 'backend-env', variable: 'BACKEND_ENV_FILE')]) {
          sh 'docker compose up -d --no-build --remove-orphans'
        }
      }
    }
  }
}
