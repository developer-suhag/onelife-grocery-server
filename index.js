const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("OneLife Grocery Server is running");
});

app.listen(port, () => {
  console.log(`OneLife Grocery listening at ${port}`);
});
