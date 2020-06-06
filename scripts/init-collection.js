sh.enableSharding('test')
use test
db.cars.drop() // drop collection for creation safety
db.createCollection('cars')
db.cars.createIndex({id:1}, {unique: true})
sh.shardCollection('test.cars', {id: 'hashed'}, false, {numInitialChunks: 2})
db.cars.getShardDistribution()
