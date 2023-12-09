pipeline {
    agent any
    environment {
        GH_TOKEN  = credentials('GITHUB_CREDENTIALS_ID')
        GOOGLE_APPLICATION_CREDENTIALS = credentials('webapp-operator-gcp')
        HELM_CHART_REPO = 'https://github.com/cyse7125-fall2023-group2/webapp-helm-chart'
        HELM_RELEASE_NAME = 'webapp'
        WEBAPP_NS = 'webapp'
        HELM_CHART_NAME = "csye7125-chart"
        PROJECT_ID = 'csye7125-cloud-003'
        CLUSTER_NAME = 'csye7125-cloud-003-gke'
        REGION = 'us-east1'
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

    stage('Gcloud auth setup'){
        steps{
            script{
                    withCredentials([file(credentialsId: 'webapp-operator-gcp', variable: 'SA_KEY')]) {

                  sh """
                    gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}
                    gcloud config set project ${PROJECT_ID}
                    gcloud container clusters get-credentials ${CLUSTER_NAME} --region ${REGION} --project ${PROJECT_ID}
                    """
                }

            }
        }
    }


    stage('install istio'){
        steps{
            script{
                def istioSysNSExists = sh(script: "kubectl get namespace istio-system", returnStatus: true) == 0
                def istioIngressNSExists = sh(script: "kubectl get namespace istio-ingress", returnStatus: true) == 0
                def webappNSExists = sh(script: "kubectl get namespace ${HELM_RELEASE_NAME}", returnStatus: true) == 0

                sh """
                    helm repo add istio https://istio-release.storage.googleapis.com/charts
                    helm repo update
                """

                if (!istioSysNSExists) {
                    sh """
                        kubectl create namespace istio-system
                    """
                }

                if (!istioIngressNSExists) {
                    sh """
                        kubectl create namespace istio-ingress
                    """
                }

                def baseReleaseExists = sh(script: "helm get values istio-base -n istio-system > /dev/null 2>&1", returnStatus: true)

                if (baseReleaseExists == 0) {
                    sh "helm upgrade istio-base istio/base -n istio-system --set defaultRevision=default"
                } else {
                    sh "helm install istio-base istio/base -n istio-system --set defaultRevision=default"
                }

                def istiodReleaseExists = sh(script: "helm get values istiod -n istio-system > /dev/null 2>&1", returnStatus: true)

                if (istiodReleaseExists == 0) {
                    sh "helm upgrade istiod istio/istiod -n istio-system"
                } else {
                    sh "helm install istiod istio/istiod -n istio-system"
                }

                def ingressdReleaseExists = sh(script: "helm get values istio-ingress -n istio-ingress > /dev/null 2>&1", returnStatus: true)

                if (ingressdReleaseExists == 0) {
                    sh "helm upgrade istio-ingress istio/gateway -n istio-ingress"
                } else {
                    sh "helm install istio-ingress istio/gateway -n istio-ingress"
                }

                if (!webappNSExists) {
                    sh """
                        kubectl create namespace ${HELM_RELEASE_NAME}
                    """
                }

                sh "kubectl label namespace ${HELM_RELEASE_NAME} istio-injection=enabled"
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
                    def releaseExists = sh(script: "helm get values ${HELM_RELEASE_NAME} -n ${WEBAPP_NS}  > /dev/null 2>&1", returnStatus: true)                        
                      
                    if (releaseExists == 0) {
                            sh "helm upgrade ${HELM_RELEASE_NAME} ${asset_name} --set primaryContainer.tag=${GIT_COMMIT} --namespace=${WEBAPP_NS}"
                        } else {
                            sh "helm install ${HELM_RELEASE_NAME}  ${asset_name} --set primaryContainer.tag=${GIT_COMMIT} --namespace=${WEBAPP_NS}"
                        }
                    }
    
                }
            }
        }
    }
}






