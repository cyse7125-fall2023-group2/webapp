pipeline {
    agent any
    environment {
        GH_TOKEN  = credentials('GITHUB_CREDENTIALS_ID')
        HELM_CHART_REPO = 'https://github.com/cyse7125-fall2023-group2/webapp-helm-chart'
        HELM_RELEASE_NAME = 'webapp'
        HELM_CHART_NAME = "csye7125-chart"
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
                    sh "echo ${version_id}"
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
                sh 'git rev-parse HEAD > commit.txt'
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


    stage('install istio'){
        steps{
            script{
                sh """
                helm repo add istio https://istio-release.storage.googleapis.com/charts
                helm repo update
                helm install istio-base istio/base -n istio-system --create-namespace istio-system --set defaultRevision=default
                helm install istiod istio/istiod -n istio-system    
                kubectl create namespace istio-ingress
                helm install istio-ingress istio/gateway -n istio-ingress 
                kubectl create namespace ${HELM_RELEASE_NAME} 
                kubectl label namespace ${HELM_RELEASE_NAME} istio-injection=enabled
                """
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

                    asset_name = "csye7125-chart-${latestTag}.tgz"
                     sh "rm -f ${asset_name}"

                    withEnv(["GH_TOKEN=${githubToken}"]){
                        sh "gh release download ${latestTag} -R ${HELM_CHART_REPO} -p ${asset_name}"
                      }
                    def releaseExists = sh(script: "helm get values ${HELM_RELEASE_NAME} > /dev/null 2>&1", returnStatus: true)                        
                      
                    if (releaseExists == 0) {
                            sh "helm upgrade ${HELM_RELEASE_NAME} ${asset_name} --set primaryContainer.tag=${latestTag} --namespace=${HELM_RELEASE_NAME}"
                        } else {
                            sh "helm install ${HELM_RELEASE_NAME}  ${asset_name} --set primaryContainer.tag=${latestTag}"
                        }
                    }
    
                }
            }
        }
    }
}






