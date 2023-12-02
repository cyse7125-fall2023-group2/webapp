pipeline {
    agent any
    environment {
        GH_TOKEN  = credentials('GITHUB_CREDENTIALS_ID')
        HELM_CHART_REPO = 'https://github.com/cyse7125-fall2023-group2/webapp-helm-chart'
        GIT_REPO = 'cyse7125-fall2023-group2/webapp-helm-chart'
        HELM_RELEASE_NAME = 'webapp'

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
                            docker build -t sumanthksai/webapp:${GIT_COMMIT} .
                            docker push sumanthksai/webapp:${GIT_COMMIT} 
                            docker build -t sumanthksai/csye7125-flyway:latest ./database
                            docker push sumanthksai/csye7125-flyway:latest
                        """
                    }
                }
            }
        }

                stage('make deploy'){
            steps{
                script{
                    withCredentials([usernamePassword(credentialsId: 'GITHUB_CREDENTIALS_ID', usernameVariable: 'githubUsername', passwordVariable: 'githubToken')]) {
                        // def apiUrl = "https://api.github.com/repos/${GIT_REPO}/releases/latest"
                        // def releaseInfo = sh(script: "curl -s ${apiUrl}", returnStdout: true).trim()
                        // def releaseJson = readJSON text: releaseInfo

                        // RELEASE_INFO=$(curl -s "https://api.github.com/repos/${GIT_REPO}/releases/latest")

                        // # Extract the release tag name from the response
                        // RELEASE_TAG_NAME=$(echo "${RELEASE_INFO}" | jq -r '.tag_name')

                        // # Print the latest release tag name
                        // echo "Latest release tag name: ${RELEASE_TAG_NAME}"
                        git branch: 'main', credentialsId: 'GITHUB_CREDENTIALS_ID', url: 'https://github.com/cyse7125-fall2023-group2/webapp-helm-chart' 
                        latestTag= sh(returnStdout: true, script: "git describe --abbrev=0 --tags | tr -d 'v' ").trim()
                        sh "echo ${latestTag}"
                        // sh "echo ${releaseInfo}"
                        // // Get the latest release tag and name
                        // def latestTag = releaseJson.tag_name
                        // def latestName = releaseJson.name

                        sh "wget ${HELM_CHART_REPO}/releases/download/${latestTag}/csye7125-chart-${latestTag}.tgz"

                        // Check if Helm release exists
                        def releaseExists = sh(script: "helm get values ${HELM_RELEASE_NAME} > /dev/null 2>&1", returnStatus: true)

                        // Install or upgrade Helm release
                        if (releaseExists == 0) {
                            sh "helm upgrade ${HELM_RELEASE_NAME} csye7125-chart-${latestTag}.tgz --set primaryContainer.tag=${GIT_COMMIT}"
                        } else {
                            sh "helm install ${HELM_RELEASE_NAME} csye7125-chart-${latestTag}.tgz --set primaryContainer.tag=${GIT_COMMIT}"
                        }
                    }
    
                }
            }
        }
    }


}





