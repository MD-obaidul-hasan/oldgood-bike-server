const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();


const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors()); 0
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}}@cluster0.hzxv0d7.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
async function run() {
  try {
    const oldgoodbikeOptionCollection = client.db('oldgoodbike').collection('catagoriesbike');

    app.get('/catagoriesbike', async(req,res) => {
      const query = {};
      const options = await oldgoodbikeOptionCollection.find(query).toArray();
    })
  }
  finally {

  }
}
run().catch(console.log);


app.get('/', async (req, res) => {
  res.send('oldgood bike server is running')
})

app.listen(port, () => console.log(`OldGood bike running on ${port}`))