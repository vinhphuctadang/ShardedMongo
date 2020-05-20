const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'test';
// Create a new MongoClient
const client = new MongoClient(url,  { useUnifiedTopology: true } );

// Use connect method to connect to the Server


// const connectionString = 'mongodb://localhost:27017'
// const MongoClient = require('mongodb').MongoClient(connectionString, { useUnifiedTopology: true })
function connect(){
  return new Promise((resolve, reject) => {
      client.connect(function(err) {
      if (err) {
        reject(err)
        return
      }

      console.log("Connected successfully to server");
      const db = client.db(dbName);
      resolve(db)
    })
  });
}
async function init(){
  let db = await connect()
  console.log('First dropping collection cars')
  if (db.collection('cars'))
    await db.collection('cars').drop()
  console.log('Creating collection named "cars"')
  await db.createCollection("cars")
  await db.collection("cars").createIndex({id: 1})
  return db
}

async function main(){
  let db = await init()
  console.log('Insert sample documents')
  for(let i=0;i<10;++i){
    console.log(`Inserting car ${i}-th`)
    await db.collection('cars').insertOne({id: i, name: 'car'+i})
  }
  console.log('Query again ...')
  console.log(await db.collection('cars').find({}).toArray())
  console.log('Query distribution information ...')
}


main()
