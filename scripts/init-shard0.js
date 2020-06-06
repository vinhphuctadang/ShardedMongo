rs.initiate(
   {
      _id: "shard0",
      version: 1,
      members: [
         { _id: 0, host : "shard0-0:27017" },
         { _id: 1, host : "shard0-1:27017" },
      ]
   }
)
