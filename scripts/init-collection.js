sh.enableSharding('test')
use test
db.cars.drop() // drop collection for creation safety
db.createCollection('cars')

sh.shardCollection('test.cars', {id: 'hashed'}, false, {numInitialChunks: 2}) // sharding first
db.cars.createIndex({id:1}, {unique: true})
db.cars.getShardDistribution()
