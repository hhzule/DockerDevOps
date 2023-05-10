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

ERROR: for node-app Cannot start service node-app: driver failed programming external connectivity on endpoint sanjeevdocker_node-app_1 (ac3f...2): Bind for 0.0.0.0:3000 failed: port is already allocated
-solution
-docker-compose down
-docker rm -fv $(docker ps -aq)
-sudo lsof -i -P -n | grep 3000
-sudo kill <process id>

now image and container is up
-docker ps
-docker image ls

<!-- compose down -->

docker-compose down -v (-v to kill anonymous volumes)

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

<!-- add mongo to docker compose -->

add standard mongo image with environment
-docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
-docker exec -it <nameofMongoContainer> bash
-mongosh -u "root" -p "root" // to connect to mongo shell/instance

<!--  or use one command as follows -->

-docker exec -it <nameofMongoContainer> -u "root" -p "root"

-db // see the current db
-use myDb // create/switch to myDb
-show dbs // to list all dbs
-db.<collectionName>.insertOne({name: "Docker tutorial"})
-db.books.find()
-exit

<!-- add named volume for data persistance -->

add in docker compose file
now we cannot use -v flag as it will delete anonymous volumes as well as named volumes

<!--connect express(eunning in a container) to our mongo db (running in a container)  -->

-npm install mongoose // if error occurs, try deleting node_modules
stop docker and build agin as package.json changed
--docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

now provide mongo connect url, run
-docker inspect <containerName> //container with mongo
under NetworkSettings ==> Networks ==> IPAddress , get the ipaddress and add to conncettion url

-docker network ls
-docker networ inspect <networkName>

<!-- add config/config.js -->

add config file ans add environment variables in docker-compose.dev.yml
stop container and rerun

<!-- dependOn -->

in order to ensure the order in which containers would spin up, use dependsOn in docker compose, or spin up in order manually
-docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d <serviceName> //if depends on is added, that servise will spin up automatically, use --no-deps flag to stop starting linked services

- docker-compose -f docker-compose.yml -f docker-compose.-dev.yml up -d --no-deps <(serviceName)node-app>
  docker logs <(containerName)zuledocker_node-app_1> -f

<!-- create CRUD operations -->

time stamp start 2:30 - 2:50
test the api on vs code thunder client
http://localhost:3000/posts (GET)

<!-- user auth with redis -->

time stamp start 2:50 - 3:30
yarn add bcrypt , docker down and then up as node_modeles updated, or simply up again to adapt the changes made
add redis and use express session, just to learn docker and add a container
update docker-compose.yml, add a new service
yarn add redis connect-redis express-session (see npm package instruction for installation details)
-docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build -V // add -V flag to renew anonymous volume, as we have added redis and we need new updated volume

after redis is connected, update code , you can see cookie upon login,
-docker exce -it <(containerName)zuledocker_redis_1> bash // then run redis-cli or
-docker exce -it <(containerName)zuledocker_redis_1> redis-cli
-KEYS \* // get the seesion key
-GET "<key>" // to get the stored data
-DEL "<KEY>"

<!-- Load Balancer - Nginx -->

add nginx config and nginx service in docker-compose.yml and comment out exposed ports of node-app, and add port to nginx service in prod.yml

look up for express behind proxies
finally add no-cors in express

-docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --scale <(serviceName)node-app>=2

<!-- deploy to production -->

Digital ocean
-Create a droplet with Ubuntu, basic plan, regular, select data center, add password , hit create.
-Droplet created, grap the public IP, now ssh using
-ssh root@<IPFromDigitalOcean>
time stamp start 3:50
install docker => curl -fsSL https://get.docker.com -o get-docker.sh
-ls
-sh get-docker.sh
install docker compose, go to docker docs
docker-compose -v ==> out put version
pull code from github

<!-- last viewed 3:57 -->
