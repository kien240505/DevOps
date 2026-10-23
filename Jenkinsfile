pipeline {
  agent any

  stages {
    stage('Build images') {
    steps {
        bat 'set DOCKER_BUILDKIT=0 && set COMPOSE_DOCKER_CLI_BUILD=0 && docker compose build'
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
