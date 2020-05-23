# ShardedMongo
Repository for demonstrating mongo with shared options for server side better performance

## This is my personal configuration which may not suitable for production mode

In this demo, the sharded database has 3 sharded server, 1 config server (it should be 3 config server, one for each replica set, but 1 is used for demo purpose) and a mongo router (to distribute queries to shards)

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
  - rs.initiate: https://docs.mongodb.com/manual/reference/method/rs.initiate/
  - about mongod: https://docs.mongodb.com/manual/reference/program/mongod/
To create your own 'sharded' collection (see ./scripts/init-collection.sh as an example):

use test // use the 'test' database (or a database named 'test')
db.createCollection('<collection name>')
db.cars.createIndex({<field_for_indexing>: 1}, {unique: true})
sh.shardCollection('test.<collection name>', {<field_for_indexing>: <'hashed' or 1>}, false, {numInitialChunks: <number_of_chunk for 'hashed' index for sharding type}), see document at https://docs.mongodb.com/manual/reference/method/sh.shardCollection/
db.cars.getShardDistribution()
