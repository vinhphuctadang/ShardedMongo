echo 'Clearing containers'
docker-compose down --volumes # Remove running containers
docker-compose up -d # Starts all dockerized mongos, there are 1 config server, 3 replica sets and a router
echo 'Waiting for containers to complete booting up'
sleep 10 # waiting for booting up

# Folowwing are run, assumed that docker containers work fine
# Firstly, add custom config to config server

docker-compose exec config-0 sh -c "mongo --port 27017 < /scripts/init-configserver.js" # run on only 1 config server for init

# Next, run shards init scripts

docker-compose exec shard0-0 sh -c "mongo --port 27017 < /scripts/init-shard0.js"
docker-compose exec shard1-0 sh -c "mongo --port 27017 < /scripts/init-shard1.js"
# sleep 2


# Next, execute initiation on router

docker-compose exec router sh -c "mongo < /scripts/init-router.js"

# Finally, create a collection for testing

docker-compose exec router sh -c "mongo < /scripts/init-collection.js"
