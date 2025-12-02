# Safe Journey - Smart Safety Routing App

A hackathon project that helps users navigate safely by analyzing multiple routes and selecting the safest path based on real-time safety factors.

//docker 
docker build -t redisnew .
docker run --name myredisnew -d redisnew
docker ps
docker exec -it myredisnew redis-cli
docker stop myredisnew
docker ps -a
docker login
docker commit <container_id> vindhya27/redis1
docker images
docker push yourdockerid/redis1
docker rm <container_id>
docker pull yourdockerid/redis1
docker run -p 6379:6379 --name myredis -d yourdockerid/redis1

//compose
docker compose up -d
docker ps
docker compose down
docker build -t yourdockerid/redis1 .
docker compose up -d --build
//
w-8
Git Plugin
Maven Integration Plugin
Copy Artifact Plugin
Build Pipeline Plugin
Deploy to Container Plugin
Manage Jenkins → Global Tool Configuration
Under Maven → Add a Maven installation:
Name: MAVEN_HOME
Use automatic install OR provide your system path
Under Git → Make sure Git path is detected
..
Source Code Management
Select Git
Paste your Maven Java repo URL
Branches to build:
→ */main OR */master (whatever your repo uses)
Build section → click Add build step twice:
🔹 First Maven step:
Invoke top-level Maven targets
Maven version: MAVEN_HOME
Goals: clean
🔹 Second Maven step:
Invoke top-level Maven targets
Maven version: MAVEN_HOME
Goals: install
Post-build Actions:
Add Archive the artifacts
Files to archive: **/*
Add Build other projects
Projects to build: MavenJava_Test
Trigger: Only if build is stable
..
Build Environment
Tick: Delete workspace before build starts
Copy Artifacts Step:
Add build step → Copy artifacts from another project
Project name: MavenJava_Build
Build: select Stable build only
Artifacts to copy: **/*
🔹 Maven Test Step:
Add build step → Invoke top-level Maven targets
Maven version: MAVEN_HOME
Goals: test
Add Archive the artifacts
Files to archive: **/*
Click Save
..
MavenJava_Pipeline
Select: Build Pipeline View
Click OK
STEP 14 — Configure Pipeline View
In Initial Job dropdown → select
👉 MavenJava_Build
Leave layout as default
Click Apply → Save
************
ngrok http 8080
Payload URL:in GitHub webhooks
https://<your-ngrok-URL>/github-webhook/
in Jenkins mavenjava_buil->configure->build trigger->GitHub hook trigger for GITScm polling

*************
Email:
SMTP Server:
smtp.gmail.com
Click Advanced
Check Use SMTP Authentication
Username: your Gmail ID
Password: your App Password
Check Use SSL
SMTP Port:
465
Then scroll down → click Test configuration
Enter another email (like your own) and click Test.
MavenJava_Build → Configure->Add post-build action → Editable Email Notification
Default Subject:
Build Status: $BUILD_STATUS
Default Content:
Job: $JOB_NAME
Build Number: $BUILD_NUMBER
Status: $BUILD_STATUS
Link: $BUILD_URL
Triggers to enable:
✔ Success
✔ Failure
✔ Unstable
************
pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/vindhya-tech/labinternal-1.git'
            }
        }

        stage('Build Maven Project') {
            steps {
                bat 'mvn -version'
                bat 'mvn clean install'
            }
        }

        stage('Run Application') {
            steps {
                echo "Application executed successfully!"
            }
        }
    }

    post {
        success {
            echo 'BUILD SUCCESS '
        }
    }
}
*******************************web appl
pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/vindhya-tech/labinternal-1.git'
            }
        }

        stage('Clean') {
            steps {
                bat 'mvn clean'
            }
        }

        stage('Install') {
            steps {
                bat 'mvn install'
            }
        }

        stage('Test') {
            steps {
                bat 'mvn test'
            }
        }

        stage('Package') {
            steps {
                bat 'mvn package'
            }
        }

       stage('Deploy') {
    steps {
        echo "Deploying application to Tomcat..."
        bat 'copy /Y target\\*.war "C:\\Program Files\\Apache Software Foundation\\Tomcat 9.0\\webapps\\"'
    }
}


        stage('Run Application') {
            steps {
                echo "Application executed successfully!"
            }
        }
    }

    post {
        success {
            echo 'BUILD SUCCESS'
        }
    }
}
pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/vindhya-tech/labinternal-1.git'
            }
        }

        stage('Clean') {
            steps {
                bat 'mvn clean'
            }
        }

        stage('Install') {
            steps {
                bat 'mvn install'
            }
        }

        stage('Test') {
            steps {
                bat 'mvn test'
            }
        }

        stage('Package') {
            steps {
                bat 'mvn package'
            }
        }

       stage('Deploy') {
    steps {
        echo "Deploying application to Tomcat..."
        bat 'copy /Y target\\*.war "C:\\Program Files\\Apache Software Foundation\\Tomcat 9.0\\webapps\\"'
    }
}


        stage('Run Application') {
            steps {
                echo "Application executed successfully!"
            }
        }
    }

    post {
        success {
            echo 'BUILD SUCCESS'
        }
    }
}
***********scripted web
node {
    
    stage('Clone Repository') {
        git branch: 'main', url: 'https://github.com/vindhya-tech/labinternal-1.git'
    }

    stage('Clean') {
        bat "mvn clean"
    }

    stage('Install') {
        bat "mvn install"
    }

    stage('Test') {
        bat "mvn test"
    }

    stage('Package') {
        bat "mvn package"
    }

    stage('Deploy') {
        echo "Deploying WAR to Tomcat..."
        bat 'copy /Y target\\*.war "C:\\Program Files\\Apache Software Foundation\\Tomcat 9.0\\webapps\\"'
    }

    stage('Run Application') {
        echo "Application deployed successfully!"
    }
}

*************************scripted java
node {

    stage('Clone Repository') {
        git branch: 'main', url: 'https://github.com/vindhya-tech/labinternal-1.git'
    }

    stage('Clean') {
        bat 'mvn clean'
    }

    stage('Compile') {
        bat 'mvn compile'
    }

    stage('Test') {
        bat 'mvn test'
    }

    stage('Package') {
        bat 'mvn package'
    }

    stage('Deploy to Tomcat') {
        echo "Deploying WAR to Tomcat..."
        bat 'copy /Y target\\*.war "C:\\Program Files\\Apache Software Foundation\\Tomcat 9.0\\webapps\\"'
    }

    stage('Finish') {
        echo "BUILD SUCCESS — Java project built and deployed!"
    }
}

***********************
pipeline {
    agent any
    
    tools {
              maven 'MAVEN_HOME'
    }

    stages {

        stage('Clone Repository') {
            steps {
                echo "Cloning GitHub repository..."
                git branch: 'main', url: 'https://github.com/vindhya-tech/labinternal-1.git'
            }
        }

        stage('Clean Project') {
            steps {
                echo "Cleaning previous build files..."
                bat "mvn clean"
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Running mvn install..."
                bat "mvn install"
            }
        }

        stage('Run Tests') {
            steps {
                echo "Executing test cases..."
                bat "mvn test"
            }
        }

        stage('Package Application') {
            steps {
                echo "Packaging application (.jar or .war)..."
                bat "mvn package"
            }
        }

        stage('Run Application') {
            steps {
                echo "Application executed successfully!"
            }
        }
    }

    post {
        success {
            echo "BUILD SUCCESS — All stages completed"
        }
        failure {
            echo "BUILD FAILED — Please check error logs"
        }
    }
}
***************************


Minicube:
minikube start --driver=docker
minikube status
kubectl get deployments
kubectl delete deployment <name>
kubectl create deployment mynginx --image=nginx
kubectl get deployments
kubectl get pods
kubectl expose deployment mynginx --type=NodePort --port=80 --target-port=80
kubectl get service
kubectl scale deployment mynginx --replicas=4
kubectl get pods
kubectl port-forward svc/mynginx 8081:80
kubectl delete deployment mynginx
kubectl delete service mynginx
minikube stop
minikube delete

jjsm vrik euac tudg
***********
nagios:docker pull jasonrivers/nagios:latest
docker run --name nagiosdemo -p 8888:80 jasonrivers/nagios:latest
http://localhost:8888
Username: nagiosadmin
Password: nagios
docker exec -it nagiosdemo bash
cd /opt/nagios/etc/servers
nano myserver.cfg
Add this host:
define host {
    use                     linux-server
    host_name               myserver
    alias                   My Test Server
    address                 192.168.1.10
}
Save and exit.
service nagios restart
exit
Now check in UI:
Hosts → myserver → UP/DOWN status
docker stop nagiosdemo
docker rm nagiosdemo
docker rmi jasonrivers/nagios:latest





aws:
cd C:\Users\<yourname>\Downloads
ssh -i "awskey.pem" ubuntu@ec2-3-88-15-xxx.compute-1.amazonaws.com
sudo apt update
sudo apt -y upgrade
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
docker --version
sudo apt install git -y
sudo apt install nano -y
mkdir mywebapp
cd mywebapp
nano index.html
<!DOCTYPE html>
<html>
<head>
    <title>My AWS Web App</title>
</head>
<body>
    <h1>Welcome to my EC2 + Docker Deployment!</h1>
    <p>Deployed by: Vindhya</p>
</body>
</html>
CTRL + O
Press Enter
Press CTRL + X
nano Dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
sudo docker build -t mywebimage .
sudo docker run -d -p 80:80 mywebimage
sudo docker ps
http://13.201.45.77


web_jenkins:
Jenkins Dashboard → New Item
Name: MavenWeb_Build
Select Freestyle project
Click OK
✅ STEP 2 — Configure Git
Inside the job:
Description: Web Build demo
Source Code Management → Git
Paste your Maven Web project repo URL
Branch: */main or */master
✅ STEP 3 — Add Maven Build Steps
Scroll to Build:
🔹 Add Build Step → Invoke top-level Maven targets
Maven version: MAVEN_HOME
Goals: clean
🔹 Add Build Step → Invoke top-level Maven targets
Maven version: MAVEN_HOME
Goals: install
✅ STEP 4 — Add Post-build Action
Add Archive the artifacts → Files: **/*
Add Build other projects → Project: MavenWeb_Test
Trigger: Only if build is stable
STEP 5 — Create MavenWeb_Test Job

Jenkins Dashboard → New Item

Name: MavenWeb_Test

Select → Freestyle project

Click OK

🔥 STEP 6 — Configure MavenWeb_Test

Inside the job:

Description: Test demo

Scroll to Build Environment

Tick: ✔ Delete workspace before build starts

🔥 STEP 7 — Add Build Steps
(A) Copy Artifacts

Add build step → Copy artifacts from another project

Project name:

MavenWeb_Build


Build selector → ✔ Stable build only

Artifacts:

**/*

(B) Maven Test

Add build step → Invoke top-level Maven targets

Maven version: MAVEN_HOME

Goals:

test

🔥 STEP 8 — Add Post-build Action

Add Archive the artifacts

Files:

**/*


Add Build other projects

Project:

MavenWeb_Deploy


Trigger: ✔ Only if build is stable

Click Save

⭐ STEP 9 — Create MavenWeb_Deploy Job

Jenkins Dashboard → New Item

Name:

MavenWeb_Deploy


Choose Freestyle project

Click OK

⭐ STEP 10 — Configure MavenWeb_Deploy

Inside the job:

Description: Web Code Deployment

Tick: ✔ Delete workspace before build starts

⭐ STEP 11 — Copy Artifacts in Deploy Job

Add build step → Copy artifacts from another project

Project name:

MavenWeb_Test


Build selector → ✔ Stable build only

Artifacts:

**/*

⭐ STEP 12 — Add Deployment (WAR to Tomcat)

Go to Post-build Actions:

Click: Deploy WAR/EAR to a container

Fill these fields:
WAR/EAR files
**/*.war

Context path
/webpath

Add Container

Click Add container

Choose:
✔ Tomcat 9.x Remote

Tomcat Details

Credentials → Select your Tomcat admin user

Tomcat URL:

http://localhost:8085/

Click Save
⭐ STEP 13 — Run Full Web Pipeline
Go to MavenWeb_Build
Click Build Now
It must automatically run:
MavenWeb_Build → MavenWeb_Test → MavenWeb_Deploy
All should be green.
⭐ STEP 14 — Verify Deployment
Open browser:
http://localhost:8085/webpath
You should see the deployed web app.
⭐ STEP 15 — Create Web Pipeline View
Jenkins Dashboard → click +
Name:
MavenWeb_Pipeline
Select Build Pipeline View
Initial job → MavenWeb_Build
Save










