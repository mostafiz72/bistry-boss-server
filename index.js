require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware to parse JSON request bodies

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eywn0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // Create a new database
        const menuCollection = client.db("bistroBoss").collection('menu');
        const reviewCollection = client.db("bistroBoss").collection('review');
        const cartsCollection = client.db("bistroBoss").collection('carts');

        /// All foods data showig -------------------

       app.get('/menu', async (req, res) => {
           const results = await menuCollection.find().toArray();
           res.send(results);
       })

       //// get the review data showing the clint side

       app.get('/review', async (req, res) => {
        const results = await reviewCollection.find().toArray();
        res.send(results);
    })

    //// cart collection ------------

    app.get('/carts', async(req, res) => {
        const results = await cartsCollection.find().toArray();
        res.send(results);
    })

    app.post('/carts', async (req, res) => {
        const cartItem = req.body;
        const result = await cartsCollection.insertOne(cartItem);
        res.send(result);
    })
    app.delete('/carts/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await cartsCollection.deleteOne(query);
        res.send(result);
    })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Bistro boss is running on port ${port}`)
})