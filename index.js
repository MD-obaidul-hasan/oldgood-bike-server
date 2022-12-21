const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const port = process.env.PORT || 5000;

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

function verifyJWT(req, res, next) {

  const authHeader = req.headers.authorization;
  if (!authHeader) {
      return res.status(401).send('unauthorized access');
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
      if (err) {
          return res.status(403).send({ message: 'forbidden access' })
      }
      req.decoded = decoded;
      next();
  })

}

async function run() {
  try {
    const oldgoodbikeOptionCollection = client.db('oldgoodbike').collection('bikes');
    const bookingsCollection = client.db('oldgoodbike').collection('bookings'); 
    const usersCollection = client.db('oldgoodbike').collection('users'); 

    app.get('/bikes', async(req,res) => {
      const catagory = req.query.catagory
      const query = {catagory:catagory};
      const options = await oldgoodbikeOptionCollection.find(query).toArray();
      res.send(options);
    });

    app.get('/bookings', verifyJWT, async (req, res) => {
      const email = req.query.email;
      const decodedEmail = req.decoded.email;
      if(email !== decodedEmail) {
        return res.status(403).send({message: 'forbidden access'});
      }
      console.log(email);
      const query = {email: email };
      const bookings = await bookingsCollection.find(query).toArray();
      res.send(bookings);
    })

    app.post('/bookings', async(req, res) =>{
      const booking = req.body
      console.log(booking);
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    })

    app.get('/jwt', async(req, res) =>{
        const email = req.query.email;
        const query = {email: email};
        const user = await usersCollection.findOne(query);
        if(user){
          const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '1h'})
          return res.send({accessToken: token});
        }

        res.status(403).send({accessToken: ''})
    })

    app.get('/users', async(req, res) =>{
      const query ={};
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    })

    app.get('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id)}
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === 'admin'});
    })

    app.get('/users/admin/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email }
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === 'admin' });
  })

    app.post('/users', async(req, res) =>{
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    } );

    app.get('/users/:email',  async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const user = await usersCollection.findOne(query)
      res.send(user)
  });
  app.put('/users/admin/:id',verifyJWT, async (req, res) => {
    const decodedEmail = req.decoded.email;
    const query = { email: decodedEmail };
    const user = await usersCollection.findOne(query);

    if (user?.role !== 'admin') {
        return res.status(403).send({ message: 'forbidden access' })
    }

    const id = req.params.id;
    const filter = { _id: ObjectId(id) }
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
            role: 'admin'
        }
    }
    const result = await usersCollection.updateOne(filter, updatedDoc, options);
    res.send(result);
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


//DB_USER=oldgoodbike
//DB_PASS=4hLbOCZVkdIpKzuA