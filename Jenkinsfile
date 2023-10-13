node {
    
    
    stage('Clone sources') {
        git branch: 'main', credentialsId: 'csye7125', url: 'https://github.com/cyse7125-fall2023-group2/webapp.git'

    }
    stage('docker version') {
        script{
            sh 'docker --version'
        }
    }
    stage('docker build and push') {
        withDockerRegistry(credentialsId: 'docker-jenkin-id', url: 'https://index.docker.io/v1/') {
                sh 'docker build -t sumanthksai/group-csye7125:latest .'
                sh 'docker images'
                sh 'docker push sumanthksai/group-csye7125:latest'
        } 
    }

    stage('db docker build and push') {
        withDockerRegistry(credentialsId: 'docker-jenkin-id', url: 'https://index.docker.io/v1/') {
                sh 'docker build -t sumanthksai/flyway:latest ./database'
                sh 'docker images'
                sh 'docker push sumanthksai/flyway:latest'
        } 
    }

  }

