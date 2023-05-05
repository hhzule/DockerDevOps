<!-- https://www.youtube.com/watch?v=9zUHg7xjIqQ -->
<!-- SanjeevThagyani Docker DevOps FreecodecAMP -->
npm init
mpn install express
hub.docker.io
create Dockerfile
create dockerignore to omit files from copying into images

docker build . (name tag not given to image)
docker build -t node-app-image .(with name tag)
docker image ls
docker image rm <imageID> (remove image)
docker run -d --name node-app <image-name> (detached mode, with container name "node-app")
docker run -p 3000:3000 -d --name node-app <image-name>
docker ps (see containers) add -a to see all, running as well as stoped
docker rm <container-name> -f (stop running container)

see container file system
docker exec -it <container-name> bash

<!-- bind-mount volume to sync file system for continuous build -->
docker run -v <absolutePathToFolderOnLocalMAchine>:<PathToFolderInContainer> -p 3000:3000 -d --name node-app <image-name>
<!--(example)
 docker run -v /home/zule/Documents/sanjeevDocker/:/app -p 3000:3000 -d --name node-app <image-name> -->
<!-- (exapmle using variables)
docker run -v $(pwd):/app -p 3000:3000 -d --name node-app <image-name> 
 -->
 -add nodemon to update changes
 -npm install nodemon --save-dev
 -change CMD in docker file as we have added start script in package.json to run nodemon
 rebuild image and redeploy container
 -upon deleting node_modules in local directory container doesnt run, to see logs run
 -docker logs <container-name>
 -we need to use volumes to resolve this by adding new anonymous volume to the container
  -docker run -v /home/zule/Documents/sanjeevDocker/:/app -v /app/node_modules -p 3000:3000 -d --name node-app node-app-image
-make bind mount read only bind mount
 docker run -v /home/zule/Documents/sanjeevDocker/:/app:ro -v /app/node_modules -p 3000:3000 -d --name node-app node-app-image
- add env variables through command
 docker run -v /home/zule/Documents/sanjeevDocker/:/app:ro -v /app/node_modules --env PORT=3000 -p 3000:3000 -d --name node-app node-app-image
 -to provide multiple env variables through command add a .env file, add file path instead with --env-file option
  docker run -v /home/zule/Documents/sanjeevDocker/:/app:ro -v /app/node_modules --env-file ./.env -p 3000:3000 -d --name node-app node-app-image
  -list out vloumes by
  docker volume ls
  you will see multiple volumes creating as they are anonymous, hence not deleted when container deletes. run following
  -docker volume prune
  or add -fv with docker rm command
  -docker rm <container-name> -fv


  <!-- delete all containers -->
 docker rm -f $(docker ps -a -q)
  <!-- delete all volumes -->
  docker volume rm $(docker volume ls -q)
 
  <!-- docker compose to up multiple container -->
  -docker-compose up -d (dettached mode as before)

<!-- error -->
ERROR: for node-app  Cannot start service node-app: driver failed programming external connectivity on endpoint sanjeevdocker_node-app_1 (ac3f...2): Bind for 0.0.0.0:3000 failed: port is already allocated
-solution
-docker-compose down
-docker rm -fv $(docker ps -aq)
-sudo lsof -i -P -n | grep 3000
-sudo kill <process id>

now image and container is up
-docker ps
-docker image ls

<!-- compose down -->
docker-compose down -v  (-v to kill anonymous volumes)

<!-- when changes are made , we need to rebuild the image with -->
-docker-compose up -d --build

<!-- run multiple docker-compose file, order matters, base file contain contents common among differnt file -->
-docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

-docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v

same for docker-compose.yml amd docker-compose.prod.yml, but files wont sync as volumes arent mounted, we need to force the build to reflect changes
--docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

<!-- avoid dev-dependencies to be installed in container -->
add ==> RUN npm install --only=production, in Dockerfile or make differnet file contents video timestamp 1:30 - 1:45

-docker ps (to grab the name of the container)
-docker exec -it <container-name> bash

<!-- multiple containers -->
add services to dockerfile and image name (mongo) to pull, see docs as you nees env variables too







