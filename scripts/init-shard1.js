rs.initiate(
   {
      _id: "shard1",
      version: 1,
      members: [
         { _id: 0, host : "shard1-0:27017" },
         { _id: 1, host : "shard1-1:27017" },
      ]
   }
)
