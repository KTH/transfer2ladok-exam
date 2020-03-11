// Read more: https://jenkins.io/doc/book/pipeline/jenkinsfile/
pipeline {
    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
    }

    agent any

    stages {
        stage('Cleanup phase') {
            steps {
                sh 'docker network prune -f'
            }
        }
        stage('Run Evolene') {
            environment {
                COMPOSE_PROJECT_NAME = "${env.BUILD_TAG}"

                LADOK_API_BASEURL = 'https://api.test.ladok.se'
                CANVAS_TEST_PASSWORD = credentials('CANVAS_TEST_PASSWORD')
                LADOK_API_PFX_BASE64 = credentials('LADOK_API_PFX_BASE64')
                LADOK_API_PFX_PASSPHRASE = credentials('LADOK_API_PFX_PASSPHRASE')
                CANVAS_CLIENT_ID = credentials('CANVAS_CLIENT_ID_E2E')
                CANVAS_CLIENT_SECRET = credentials('CANVAS_CLIENT_SECRET_E2E')
                MONGODB_CONNECTION_STRING = credentials('MONGODB_CONNECTION_STRING')
            }
            steps {
                sh '$JENKINS_HOME/workspace/zermatt/jenkins/buildinfo-to-node-module.sh /config/version.js'
                sh 'SLACK_CHANNELS="#team-e-larande-build,#pipeline-logs" DEBUG=True $EVOLENE_DIRECTORY/run.sh'
            }
        }
        stage('Dump info') {
            steps {
                sh 'docker images'
                sh 'docker network ls'
            }
        }
    }
}
