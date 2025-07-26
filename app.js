const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3001;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const routes = require("./routes");

app.use((req, res, next) => {
  req.user = {
    _id: "6882520e925d670ca15a2e66",
  };
  next();
});

app.use(express.json());
app.use("/", routes);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
