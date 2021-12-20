const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
// port
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

// connection uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qow90.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("onelfe_grocery");
    const groceryCollection = database.collection("groceries");

    // get groceries
    app.get("/groceries", async (req, res) => {
      const groceries = await groceryCollection.find({}).toArray();
      res.send(groceries);
    });
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("OneLife Grocery Server is running");
});

app.listen(port, () => {
  console.log(`OneLife Grocery listening at ${port}`);
});
