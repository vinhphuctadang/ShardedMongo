const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'test';
// Create a new MongoClient
const client = new MongoClient(url,  { useUnifiedTopology: true } );
// should be greater than 4 due to test purpose
const expectedUpsertActionCount = 1000
const expectedSelectActionCount = 10
const expectedDeleteActionCount = 10

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

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
  return db
}

async function insert(db){
  let count = 0
  let marked = Date.now()
  await new Promise((resolve, reject)=>{
    for(let i=0;i<expectedUpsertActionCount;++i){
      db.collection('cars').findOneAndUpdate({id: i}, {$set: {name: 'car'+i}}, {upsert: true}).then(
        res => {
          count ++
          if (count >= expectedUpsertActionCount) resolve()
        }
      )
    }
  })
  console.log('Time consumed for concurrent for upsertion:', Date.now() - marked, 'ms')
}

async function select(db){
  let count = 0
  let marked = Date.now()
  await new Promise((resolve, reject)=>{
    for(let i=0;i<expectedSelectActionCount;++i){
      lowerBound = getRandomInt(expectedUpsertActionCount)
      upperBound = lowerBound + getRandomInt(expectedUpsertActionCount-lowerBound+1)
      db.collection('cars').find({id: {$gt: lowerBound, $lt: upperBound}}).toArray().then(
        res => {
          count ++
          if (count >= expectedSelectActionCount) resolve()
        }
      )
    }
  })
  console.log('Time consumed for concurrent selection:', Date.now() - marked, 'ms')
}

async function del(db){
  let count = 0
  let marked = Date.now()
  await new Promise((resolve, reject)=>{
    for(let i=0;i<expectedDeleteActionCount;++i){
      lowerBound = getRandomInt(expectedUpsertActionCount)
      upperBound = lowerBound + getRandomInt(expectedUpsertActionCount-lowerBound+1)
      db.collection('cars').deleteMany({id: {$gt: lowerBound, $lt: upperBound}}).then(
        res => {
          count ++
          if (count >= expectedDeleteActionCount) resolve()
        }
      )
    }
  })
  console.log('Time consumed for concurrent deletion:', Date.now() - marked, 'ms')
}

async function main(){
  let db = await init()
  console.log('Insert sample documents')
  await insert(db)
  await select(db)
  await del(db)
}


main()
