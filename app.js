const express = require("express");
const ArticleRoutes = require("./routes/article.routes");
const mongodb = require("./mongodb/mongodb.connect");

const app = express();

mongodb.connect();

app.use(express.json());

app.use("/articles", ArticleRoutes);

app.use((error, req, res, next) => {
  console.log("An Error has been thrown!")
  res.status(500).json({message:error.message});
});

app.get("/", (req, res) =>{
  res.json("Hello World!");
});

module.exports = app;