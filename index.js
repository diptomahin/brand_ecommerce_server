const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port= process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pwyhut1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      // await client.connect();
  
      
      const productCollection = client.db('BrandDummy').collection('products');
      const cartCollection = client.db('BrandDummy').collection('mycart');
  
    app.get('/products', async (req, res) => {
        const cursor =  productCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
  
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query);
      res.send(result);
  })
   
  //cart
  app.post('/mycart', async (req, res) => {
    const addedProduct = req.body
    const result = await cartCollection.insertOne(addedProduct)
    res.send(result)
  });

  app.get('/mycart', async (req, res) => {
    const cursor =  cartCollection.find();
    const result = await cursor.toArray();
    res.send(result);
});

app.get('/mycart/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await cartCollection.findOne(query);
  res.send(result);
});

app.delete('/mycart/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await cartCollection.deleteOne(query);
  res.send(result);
});




      // Send a ping to confirm a successful connection
      // await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
     res.send(' server in running ')
});

app.listen(port,()=>{
     console.log(`server is running on port ${port}`)
})
