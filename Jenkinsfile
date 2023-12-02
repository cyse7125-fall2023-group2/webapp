pipeline {
    agent any
    environment {
        GH_TOKEN  = credentials('GITHUB_CREDENTIALS_ID')
    }
    stages{
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
        stage('post-release') {
                steps {
                    script {
                        // Define credentials for GitHub
                        withCredentials([usernamePassword(credentialsId: 'GITHUB_CREDENTIALS_ID', usernameVariable: 'githubUsername', passwordVariable: 'githubToken')]) {
                        version_id= sh(returnStdout: true, script: "git describe --abbrev=0 --tags | tr -d 'v' ").trim()
                    }
                }
            }
            }

        stage('docker version') {
                steps {
                    sh 'docker --version'
                }
            }

        stage('fetch git commit') {
                steps {
                    sh 'docker --version'
                }
            }


        stage('app docker build and push') {
                steps {
                    script {
                        // Define credentials for Docker Hub
                        withCredentials([usernamePassword(credentialsId: 'DOCKER_HUB_ID', usernameVariable: 'dockerHubUsername', passwordVariable: 'dockerHubPassword')]) {
                            env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                            sh """
                                echo ${env.GIT_COMMIT}
                                docker login -u \${dockerHubUsername} -p \${dockerHubPassword}
                                docker build -t sumanthksai/webapp:${env.GIT_COMMIT} .
                                docker push sumanthksai/webapp:${env.GIT_COMMIT} 
                                docker build -t sumanthksai/csye7125-flyway:latest ./database
                                docker push sumanthksai/csye7125-flyway:latest
                            """
                        }
                    }
                }
            }


    }
}




