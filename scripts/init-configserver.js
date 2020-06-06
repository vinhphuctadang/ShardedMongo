rs.initiate(
   {
      _id: "configserver",
      configsvr: true,
      version: 1,
      members: [
         { _id: 0, host : "config-0:27017" },
         { _id: 1, host : "config-1:27017" },
      ]
   }
)
