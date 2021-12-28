const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const stripe = require("stripe")(process.env.STRIPE_SECRET);
// const admin = require("firebase-admin");
// const { initializeApp } = require("firebase-admin/app");

const app = express();
// port
const port = process.env.PORT || 5000;

// firebase admin sdk

// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

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
    const orderCollection = database.collection("orders");

    // get groceries
    app.get("/groceries", async (req, res) => {
      const groceries = await groceryCollection.find({}).toArray();
      res.send(groceries);
    });
    // get single grocery by id
    app.get("/groceries/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await groceryCollection.findOne(query);
      res.send(result);
    });

    // // post order api
    app.post("/order", async (req, res) => {
      const order = req.body;
      const result = orderCollection.insertOne(order);
      res.json(result);
    });
    // app.post("/orders", async (req, res) => {
    //   const payment = req.body;
    //   const result = orderCollection.insertOne(payment);
    //   res.json(result);
    // });

    // // stripe payment
    // app.post("/create-payment-intent", async (req, res) => {
    //   const paymentInfo = req.body;
    //   const amount = paymentInfo.price * 100;
    //   const paymentIntent = await stripe.paymentIntents.create({
    //     amount: amount,
    //     currency: "usd",
    //     payment_method_types: ["card"],
    //   });
    //   res.json({ clientSecret: paymentIntent.client_secret });
    // });

    //
    //
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
