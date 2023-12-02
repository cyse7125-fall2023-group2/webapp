pipeline {
    agent any
    environment {
        GH_TOKEN  = credentials('GITHUB_CREDENTIALS_ID')
        HELM_CHART_REPO = 'https://github.com/cyse7125-fall2023-group2/webapp-helm-chart'
        GIT_REPO = 'cyse7125-fall2023-group2/webapp-helm-chart'
        HELM_RELEASE_NAME = 'webapp'
        GITHUB_REPO_OWNER = 'cyse7125-fall2023-group2'
        GITHUB_REPO_NAME = 'webapp-helm-chart'
        HELM_VERSION = 'v3.2.4'
        HELM_URL = "https://get.helm.sh/helm-${env.HELM_VERSION}-linux-amd64.tar.gz"
        HELM_PATH = "${JENKINS_HOME}/tools/helm/${env.HELM_VERSION}/linux-amd64/helm"
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

    stage('make deploy'){
            steps{
                script{
                    withCredentials([usernamePassword(credentialsId: 'GITHUB_CREDENTIALS_ID', usernameVariable: 'githubUsername', passwordVariable: 'githubToken')]) {
                        git branch: 'main', credentialsId: 'GITHUB_CREDENTIALS_ID', url: 'https://github.com/cyse7125-fall2023-group2/webapp-helm-chart' 
                        latestTag= sh(returnStdout: true, script: "git describe --abbrev=0 --tags | tr -d 'v' ").trim()
                        sh "echo ${latestTag}"

                        // withEnv(["GH_TOKEN=${githubToken}"]){
                        //     sh "curl -LO  -L ${HELM_CHART_REPO}/releases/download/${latestTag}/csye7125-chart-${latestTag}.tgz"
                        // }

                    sh "curl -O https://github.com/${env.GITHUB_REPO_OWNER}/${env.GITHUB_REPO_NAME}/releases/download/${latestTag}/csye7125-chart-${latestTag}.tgz"
                    sh "tar -xzvf csye7125-chart-${latestTag}.tgz"
                        // Check if Helm release exists
                    def releaseExists = sh(script: "helm get values ${HELM_RELEASE_NAME} > /dev/null 2>&1", returnStatus: true)
                        
                        // sh"cat csye7125-chart-${latestTag}.tgz"
                        // Install or upgrade Helm release
                    if (releaseExists == 0) {
                            sh "helm upgrade ${HELM_RELEASE_NAME} csye7125-chart-${latestTag}.tgz --set primaryContainer.tag=${env.GIT_COMMIT}"
                        } else {
                            sh "helm install ${HELM_RELEASE_NAME} csye7125-chart-${latestTag}.tgz --set primaryContainer.tag=${env.GIT_COMMIT}"
                        }
                    }
    
                }
            }
        }
    }
}






