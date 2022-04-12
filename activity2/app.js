const express = require("express");
const ArticleRoutes = require("./routes/article.routes");
const fs = require('fs');
const mainPagePath = './rawdata/mainpage.html';
const articlesPagePath = './rawdata/articlespage.html';

const app = express();

app.use(express.json());

app.use("/articles", ArticleRoutes);

app.use((error, req, res, next) => {
  console.log("An Error has been thrown!")
  res.status(500).json({message:error.message});
});

app.get("/", (req, res) =>{
  fs.readFile(mainPagePath, function (err, html) {
    if (err) {
      res.writeHead(404);
      res.end("404 Not Found: " + JSON.stringify(err));
      return; 
    }    
    res.writeHeader(200, {"Content-Type": "text/html"});  
    res.write(html);  
    res.end(); 
  });
});

module.exports = app;