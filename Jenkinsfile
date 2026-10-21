pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Website') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                            test -f index.html
                            test -f style.css
                            test -f script.js
                            echo "Website files validated successfully"
                        '''
                    } else {
                        bat '''
                            if not exist index.html exit /b 1
                            if not exist style.css exit /b 1
                            if not exist script.js exit /b 1
                            echo Website files validated successfully
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Student Study Planner validation passed!'
        }
        failure {
            echo 'Build failed. Check the console output.'
        }
    }
}
