node {
    

    stage('Fetch GitHub Credentials') {
        withCredentials([usernamePassword(credentialsId: 'GITHUB_CREDENTIALS_ID', usernameVariable: 'GITHUB_USERNAME', passwordVariable: 'GITHUB_TOKEN')]) {
            def githubUsername = ${{ secrets.GITHUB_USERNAME }}
            def githubToken = ${{ secrets.GITHUB_TOKEN }}

            // Use GitHub credentials for cloning the repository
            git branch: 'main', url: 'https://$githubUsername:$githubToken@github.com/cyse7125-fall2023-group2/webapp.git'
        }
    }

    stage('docker version') {
        script{
            sh 'docker --version'
        }
    }

    stage('app docker build and push') {
            withCredentials([usernamePassword(credentialsId: DOCKER_HUB_USERNAME, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                def dockerHubUsername = ${{ secrets.DOCKER_USERNAME }}
                def dockerHubPassword = ${{ secrets.DOCKER_PASSWORD }}
                sh """
                    docker login -u $dockerHubUsername -p $dockerHubPassword
                    docker build -t sumanthksai/group-csye7125:latest ./database                
                    docker push sumanthksai/group-csye7125:latest
                """
        } 
    }

        stage('db docker build and push') {
            withCredentials([usernamePassword(credentialsId: DOCKER_HUB_USERNAME, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                def dockerHubUsername = env.DOCKER_USERNAME
                def dockerHubPassword = env.DOCKER_PASSWORD
                sh """
                    docker login -u $dockerHubUsername -p $dockerHubPassword
                    docker build -t sumanthksai/flyway:latest ./database                
                    docker push sumanthksai/flyway:latest
                """
        } 
    }

  }

