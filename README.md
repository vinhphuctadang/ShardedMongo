# ShardedMongo
Repository for demonstrating mongo with shared options for server side better performance

**This is my personal configuration which may not suitable for production mode**

In this demo, the 'sharded' database has 2 sharded servers, 2 config server and a mongo router (to distribute queries to shards)

## Prerequisite:
- docker

On Windows, navigate to [Docker home page](https://www.docker.com/products/docker-desktop) for download docker desktop
```
sudo apt install docker.io
```

- docker-compose

Windows/MacOS

As stated in docker compose install [page](https://docs.docker.com/compose/install/)

"Docker Desktop for Mac and Docker Toolbox already include Compose along with other Docker apps", which mean the desktop version of docker includes 'docker-compose'

Linux:
```
sudo apt install docker-compose
```
**Important**
On Linux:
- Don't forget to append current user to 'docker group' on ubuntu
sudo usermod -aG docker $USER

## Steps for Mongo sharding:
- Create mongo config server (configsvr)
- Create mongo shard server (shardsvr)
- Create mongo router

### What's next ?
- Run init scripts on each server to build a 'network'
```
./init.sh
```
See comments in ```init.sh``` for details

- Create a collection and 'sharding' it, example have already run in ```./init.sh```
  Some referred documents:
  - rs.initiate: https://docs.mongodb.com/manual/reference/method/rs.initiate/, as is documented there, rs.initiate must run on ONLY one mongod instance for the replica set
  - about mongod: https://docs.mongodb.com/manual/reference/program/mongod/

To create **your own 'sharded'** collection (see ./scripts/init-collection.sh as an example):

```
use test // use the 'test' database (or a database named 'test')
db.createCollection('<collection name>') // create a collection named <collection name>
db.cars.createIndex({<field_for_indexing>: 1}, {unique: true}) // create an index for created collection
sh.shardCollection('test.<collection name>', {<field_for_indexing>: <'hashed' or 1>}, false, {numInitialChunks: <number_of_chunk for 'hashed' index for sharding type}), see document at https://docs.mongodb.com/manual/reference/method/sh.shardCollection/
db.cars.getShardDistribution() // see distribution status
```
### Notes:
- We should turn of the mongod service on port 27017 to make mongo container start binding on the port
To turn off mongod service:
```
sudo service mongod stop
```

Sometimes, port 27017 are binded, we should check for processes which bind the port to kill them (the process) in order to make docker binds the port. We have another choice: Edit my configuration where port 27017 should be changed

### Common problems
- You cannot run the ./init.sh
You maybe stucked at one of the problems:
  - Add execution privilege ```sudo chmod +x ./init.sh```
  - docker-compose not installed:
	Check docker (and docker-compose, on linux, on windows/macos check docker desktop version) or try re-installing docker and docker-compose and run them with 'sudo' privilege (or run as administrator)

  - Ports are already in use:
	Run ```netstat -lnpt``` to figure out which processes hangs/bind these port, simply kill them if those processes are not needed

Any other problems on config and code, please report them [here](https://github.com/vinhphuctadang/ShardedMongo/issues)
