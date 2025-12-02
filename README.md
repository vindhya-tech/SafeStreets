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





