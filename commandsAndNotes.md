<!-- https://www.youtube.com/watch?v=9zUHg7xjIqQ -->
<!-- SanjeevThagyani Docker DevOps FreecodecAMP -->

# Initialize project

`npm init`  
`npm install express`  
hub.docker.io

- create `Dockerfile`
- create `.dockerignore`// to omit files from copying into images

# Docker commands

`docker build .` (name tag not given to image)  
`docker build -t node-app-image .`(with name tag)  
`docker image ls`  
`docker image rm <imageID>` (remove image)  
`docker run -d --name node-app <image-name>` (detached mode, with container name "node-app")  
`docker run -p 3000:3000 -d --name node-app <image-name>`  
`docker ps` (see containers) add -a to see all, running as well as stoped  
`docker rm <container-name> -f `(stop running container)

# see container file system

`docker exec -it <container-name> bash`

# Bind-mount volume

to sync file system for continuous build

`docker run -v <absolutePathToFolderOnLocalMAchine>:<PathToFolderInContainer> -p 3000:3000 -d --name node-app <image-name>`

(example)
`docker run -v /home/zule/Documents/zuleDocker/:/app -p 3000:3000 -d --name node-app <image-name>`  
(exapmle using variables)
`docker run -v $(pwd):/app -p 3000:3000 -d --name node-app <image-name>`

add nodemon to update changes  
`npm install nodemon --save-dev`  
change CMD in docker file, as we have added start script in package.json to run nodemon, rebuild image and redeploy container  
upon deleting node_modules in local directory, container doesnt run,

# See logs run

`docker logs <container-name>`

we need to use volumes to resolve this by adding new anonymous volume to the container  
`docker run -v /home/zule/Documents/zuleDocker/:/app -v /app/node_modules -p 3000:3000 -d --name node-app node-app-image`

make bind mount read only bind mount

`docker run -v /home/zule/Documents/zuleDocker/:/app:ro -v /app/node_modules -p 3000:3000 -d --name node-app node-app-image`

add env variables through command  
 `docker run -v /home/zule/Documents/zuleDocker/:/app:ro -v /app/node_modules --env PORT=3000 -p 3000:3000 -d --name node-app node-app-image`

to provide multiple env variables through command add a .env file, add file path instead with --env-file option  
 `docker run -v /home/zule/Documents/zuleDocker/:/app:ro -v /app/node_modules --env-file ./.env -p 3000:3000 -d --name node-app node-app-image`

# list out volumes

`docker volume ls`

you will see multiple volumes creating as they are anonymous, hence not deleted when container gets deleted. run following  
 `docker volume prune`  
 or add -fv with docker rm command  
 `docker rm <container-name> -fv`

# Delete all containers

`docker rm -f $(docker ps -a -q)`

# Delete all volumes

`docker volume rm $(docker volume ls -q)`

# Docker compose

to up multiple container

`docker-compose up -d` (dettached mode as before)

### Error Handling

ERROR: for node-app Cannot start service node-app: driver failed programming external connectivity on endpoint zuledocker_node-app_1 (ac3f...2): Bind for 0.0.0.0:3000 failed: port is already allocated

## solution

`docker-compose down`  
`docker rm -fv $(docker ps -aq)`  
`sudo lsof -i -P -n | grep 3000`  
`sudo kill <process id>`

now image and container is up

`docker ps`  
`docker image ls`

# Docker compose down

`docker-compose down -v` (-v to kill anonymous volumes)

# Rebuild the image upon change

`docker-compose up -d --build`

# Run multiple docker-compose file

order matters, base file contain contents common among differnt file

`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d`

`docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v`

same for docker-compose.yml and docker-compose.prod.yml, but files wont sync as volumes arent mounted, we need to force the build to reflect changes

`docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build`

# avoid dev-dependencies to be installed in container

add ==> RUN npm install `--only=production`, in Dockerfile or make differnet file contents  
video timestamp 1:30 - 1:45

`docker ps (to grab the name of the container)`  
`docker exec -it <container-name> bash`

# Multiple containers

add services to dockerfile and image name (mongo) to pull, see docs as you nees env variables too

## Add mongo to docker compose

add standard mongo image with environment  
`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build`  
`docker exec -it <nameofMongoContainer> bash`  
`mongosh -u "root" -p "root"` // to connect to mongo shell/instance

or use one command as follows

`docker exec -it <nameofMongoContainer> -u "root" -p "root"`

`db` // see the current db  
`use myDb` // create/switch to myDb  
`show dbs` // to list all dbs  
`db.<collectionName>.insertOne({name: "Docker tutorial"}) `  
`db.books.find()`  
`exit`

## Add named volume for data persistance

add in docker compose file  
now we cannot use -v flag as it will delete anonymous volumes as well as named volumes

## Connect express(ruunning in a container) to our mongo db (running in a container)

`npm install mongoose` // if error occurs, try deleting node_modules  
stop docker and build agin as package.json changed  
`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build`

now provide mongo connect url, run  
`docker inspect <containerName>` //container with mongo
under NetworkSettings ==> Networks ==> IPAddress , get the ipaddress and add to conncettion url

`docker network ls`  
`docker networ inspect <networkName>`

## Add config/config.js

add config file and add environment variables in docker-compose.dev.yml, stop container and rerun

## DependOn

in order to ensure the order in which containers would spin up, use dependsOn in docker compose, or spin up in order manually  
`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d <serviceName>` //if depends on is added, that servise will spin up automatically, use --no-deps flag to stop starting linked services

`docker-compose -f docker-compose.yml -f docker-compose.-dev.yml up -d --no-deps <(serviceName)node-app>`  
`docker logs <(containerName)zuledocker_node-app_1> -f`

## Create CRUD operations

time stamp start 2:30 - 2:50
test the api on vs code thunder client

`http://localhost:3000/posts `(GET)

## User auth with redis

time stamp start 2:50 - 3:30

`yarn add bcrypt`  
 docker down and then up as node_modeles updated, or simply up again to adapt the changes made, add redis and use express session, just to learn docker and add a container, update docker-compose.yml, add a new service  
`yarn add redis connect-redis express-session` (see npm package instruction for installation details)  
`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build -V` // add -V flag to renew anonymous volume, as we have added redis and we need new updated volume

after redis is connected, update code , you can see cookie upon login,
`docker exce -it <(containerName)zuledocker_redis_1> bash` // then run redis-cli or  
`docker exce -it <(containerName)zuledocker_redis_1> redis-cli`  
`KEYS \*` // get the seesion key  
`GET "<key>"` // to get the stored data  
`DEL "<KEY>"`

# Load Balancer - Nginx

add nginx config and nginx service in docker-compose.yml and comment out exposed ports of node-app, and add port to nginx service in prod.yml

look up for express behind proxies
finally add no-cors in express

`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --scale <(serviceName)node-app>=2`

# Deploy to production

Digital ocean

- Create a droplet with Ubuntu, basic plan, regular, select data center, add password , hit create.
- Droplet created, grap the public IP, now ssh using
  `ssh root@<IPFromDigitalOcean>`

time stamp start 3:50

- install docker =>  
  `curl -fsSL https://get.docker.com -o get-docker.sh`  
  `ls`  
  `sh get-docker.sh`

- install docker compose, go to docker docs

- add environment variables on server and update docker compose production file

- create a file ( .env ) to add all env variables, should not be on the same path as the repo code, for persistance.  
  making on root, now go to .profile and add  
  `set -o allexport; source /root/.env; set +o allexport`  
  exit for changes to take effect nas then ssh again  
  `ssh root@<IPFromDigitalOcean>`
  `printenv`

## Option A (not recommended for production)

- pull code from github  
  `git clone https://github.com/hhzule/DockerDevOps.git`

- run docker compose  
  `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`

- pull up the ip from digital ocean, test the api

## Option B

- login to Docker hub, create a repository, now tag the image to append docker repository name,  
  `docker image tag <currentName> <dockerUserName>/<dockerRepoName>`

- add Image in docker-compose.yml

- make code changes, build the image on local system and push to docker-hub  
  `docker-compose -f docker-compose.yml -f docker-compose.prod.yml build` or

`docker-compose -f docker-compose.yml -f docker-compose.prod.yml build <serviceName>` if you only want to build specific service.

- push to docker hub, from development environment  
  `docker-compose -f docker-compose.yml -f docker-compose.prod.yml push <serviceName>`

- pull the image in server

`docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull`  
or  
`docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull <serviceName>`

- docker-compose up

`docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`

or  
`docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps <serviceName>`

- pull up the ip from digital ocean, test the api

## Automate the flow

### watchtower

github page , watchtower docs,  
`docker run -d --name watchtower -e WATCHTOWER_TRACE=true -e WATCHTOWER_DEBUG=true -e WATCHTOWER_POLL_INTERVAL=50 -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower <servicesToWatch>`

login if using private images

# Docker Swarm

activate docker swarm in the prduction environment, t
get the public IP provided by digital ocean,

`docker swarm init --advertise-addr <IP-address>`

to access all swarm related commands

`docker service --help`  
 add the following in the _docker-compose.prod.yml_ as swarm configuration is only used in production

```js
    deploy:
     replicas: 8
     restart_policy:
       condition: any
     update_config:
       parallelism: 2
       delay: 15s
```

git push

git pull (in prod environment)

pull down the old services and run

`docker stack deploy -c <composefile1> -c <composefile2> <give-stack-name>`

`docker node ls` list out all nodes

`docker stack ls` list out all stacks

`docker ps` list out all replicas

`docker service ls` list out all stacks

`docker stack ps` list out all services in a stack

# Pushing changes to Swarm stack

<!-- last viewed 4:53 -->
