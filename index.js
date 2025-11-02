const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = 3000;
// middleware
app.use(cors());
app.use(express.json());

// mongodb connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rfkbq1n.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    const DB = client.db("RentACar");
    const carCollection = DB.collection("cars");
    await client.connect();

    // post data to mongoDB
    app.post("/cars", async (req, res) => {
      const query = req.body;
      const result = await carCollection.insertOne(query);
      res.send(result);
    });

    // get all cars
    app.get("/cars", async (req, res) => {
      const cursor = carCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get specific cars
    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carCollection.findOne(query);
      res.send(result);
    });

    // update cars
    app.put("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedCar = req.body;
      const updateDoc = {
        $set: updatedCar,
      };
      const result = await carCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // delete cars
    app.delete("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carCollection.deleteOne(query);
      req.send(result);
    });
    // Send a ping to confirm a successful connection

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Rent A Car Server Running!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
