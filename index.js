const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();




const app = express();

//middleware
app.use(cors()); 0
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c20znev.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri)
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
async function run() {
  try {
    const oldgoodbikeOptionCollection = client.db('oldgoodbike').collection('bikes');
    const bookingsCollection = client.db('oldgoodbike').collection('bookings'); 
    // const usersCollection = client.db('goodoldbike').collection('users'); 

    app.get('/bikes', async(req,res) => {
      const catagory = req.query.catagory
      const query = {catagory:catagory};
      const options = await oldgoodbikeOptionCollection.find(query).toArray();
      res.send(options);
    });

    // app.get('/bookings', async (req, res) => {
    //   const email = req.query.email;
    //   const query = {email: email};
    //   const bookings = await bookingsCollection.find(query).toArray();
    //   res.send(bookings);
    // })

    app.post('/bookings', async(req, res) =>{
      const booking = req.body
      console.log(booking);
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    })

    

    // app.post('/users', async(req, res) =>{
    //   const user = req.body;
    //   console.log(user);
    //   const result = await usersCollection.insertOne(user);
    //   res.send(result);
    // } )

  }
  finally {

  }
}
run().catch(console.log);


app.get('/', async (req, res) => {
  res.send('oldgood bike server is running')
})



app.listen(port, () => console.log(`OldGood bike running on ${port}`))


//DB_USER=oldgoodbike
//DB_PASS=4hLbOCZVkdIpKzuA