pipelineJob('webapp') {
    description('My Pipeline Job Description')
    triggers {
          hudsonStartupTrigger {
            nodeParameterName("main")
            label("main")
            quietPeriod("0")
            runOnChoice("False")
          }
        githubPush() // Trigger the job on a GitHub push event

    }
    definition {
        cpsScm {
            scriptPath('Jenkinsfile') // Reference the Jenkinsfile in your SCM
            scm {
                git {
                    remote {
                        url('https://github.com/cyse7125-fall2023-group2/webapp.git')
                        credentials('GITHUB_CREDENTIALS_ID') // Specify your GitHub credentials ID
                    }
                    branch('main') // Specify the branch you want to build
                }
            }
        }
    }
}