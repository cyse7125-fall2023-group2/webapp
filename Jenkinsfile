pipeline {
    agent any
    environment {
        GH_TOKEN  = credentials('GITHUB_CREDENTIALS_ID')
    }
    stages {
        stage('Fetch GitHub Credentials') {
            steps {
                script {
                    // Define credentials for GitHub
                    withCredentials([usernamePassword(credentialsId: 'GITHUB_CREDENTIALS_ID', usernameVariable: 'githubUsername', passwordVariable: 'githubToken')]) {
                        git branch: 'main', credentialsId: 'GITHUB_CREDENTIALS_ID', url: 'https://github.com/cyse7125-fall2023-group2/webapp'        
                    }
                }
            }
        }
        
        stage('ci-checks') {
            steps {
                sh '''
                node --version
                npm --version
                npm ci
                '''
            }
        }

        stage('release') {
            steps {
                script {
                    // Define credentials for GitHub
                    withCredentials([usernamePassword(credentialsId: 'GITHUB_CREDENTIALS_ID', usernameVariable: 'githubUsername', passwordVariable: 'githubToken')]) {
                      withEnv(["GH_TOKEN=${githubToken}"]){
                       sh """
                            npx semantic-release
                       """
                      }     
                    }
                }
            }
        }

        stage('docker version') {
            steps {
                sh 'docker --version'
            }
        }
        stage('app docker build and push') {
            steps {
                script {
                    // Define credentials for Docker Hub
                    withCredentials([usernamePassword(credentialsId: 'DOCKER_HUB_ID', usernameVariable: 'dockerHubUsername', passwordVariable: 'dockerHubPassword')]) {
                        sh """
                            docker login -u \${dockerHubUsername} -p \${dockerHubPassword}
                            docker build -t sumanthksai/group-csye7125:latest .
                            docker push sumanthksai/group-csye7125:latest
                            docker build -t sumanthksai/flyway:latest ./database
                            docker push sumanthksai/flyway:latest
                        """
                    }
                }
            }
        }
    }


}

