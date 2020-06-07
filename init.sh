checkMongoOk(){
  container=$1
  docker-compose exec router sh -c "mongo --eval \"connect('127.0.0.1:27017').stats().ok\" --quiet" > /dev/null
  res=$?
  echo $res
}

echo 'Clearing containers'
docker-compose down --volumes # Remove running containers
docker-compose up -d # Starts all dockerized mongos, there are 1 config server, 3 replica sets and a router
echo 'Waiting for shards and config servers to complete booting up'
sleep 10

echo "Now shards and config server are running properly, we run init scripts for them"
# sleep 20 # waiting for booting up
# Folowwing are run, assumed that docker containers work fine

# Firstly, add custom config to config server
docker-compose exec config-0 sh -c "mongo --port 27017 < /scripts/init-configserver.js" # run on only 1 config server for init

# Next, run shards init scripts

docker-compose exec shard0-0 sh -c "mongo --port 27017 < /scripts/init-shard0.js"
docker-compose exec shard1-0 sh -c "mongo --port 27017 < /scripts/init-shard1.js"


echo "Then we are waiting for routers, since it need times to find configservers and shards"
isOk=0
while [ $isOk -eq 0 ]
do
  isOk=1
  res=$(checkMongoOk router)
  echo 'Connection status:' $res
  if [ "$res" != "0" ]; then
    isOk=0
  fi

  if [ $isOk -eq 0 ]; then
    echo "Still waiting for the router to complete booting up"
    sleep 2
  fi
done

# Next, execute initiation on router

echo "Router is now running properly, we run init scripts for routers"
echo "Running init-router.js"
docker-compose exec router sh -c "mongo --port 27017 < /scripts/init-router.js"
echo "Running init-collection.js"
# Finally, create a collection for testing

docker-compose exec router sh -c "mongo --port 27017 < /scripts/init-collection.js"
