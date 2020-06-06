sh.addShard("shard0/shard0-0:27017")
sh.addShard("shard0/shard0-1:27017")
sh.addShard("shard1/shard1-0:27017")
sh.addShard("shard1/shard1-1:27017")

sh.enableSharding('test')
