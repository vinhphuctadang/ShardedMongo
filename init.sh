echo 'Clearing containers'

docker-compose down --volumes # Remove running containers
docker-compose up -d # Starts all dockerized mongos, there are 1 config server, 3 replica sets and a router
sleep 2 # waiting for booting to complete

'''
Folowwing are run, assumed that docker containers work fine
'''


'''
Firstly, add custom config to config server
'''
docker-compose exec config01 sh -c "mongo --port 27017 < /scripts/init-configserver.js"

'''
Next, run shards init scripts
'''
docker-compose exec shard01a sh -c "mongo --port 27018 < /scripts/init-shard01.js"
docker-compose exec shard02a sh -c "mongo --port 27019 < /scripts/init-shard02.js"
docker-compose exec shard03a sh -c "mongo --port 27020 < /scripts/init-shard03.js"
sleep 2

'''
Next, execute initiation on router
'''
docker-compose exec router sh -c "mongo < /scripts/init-router.js"


'''
Finally, create a collection for testing
'''
mongo < ./scripts/init-collection.js
