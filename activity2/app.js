const express = require("express");
const ArticleRoutes = require("./routes/article.routes");
const fs = require('fs');
const mainPagePath = './rawdata/mainpage.html';
const authPagePath = './rawdata/authPage.html';
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', function(req, res, next){
  console.log(req.cookies);
  if (!req.cookies.hasVisited){
    res.cookie('hasVisited', '1', 
               { maxAge: 60*60*1000, 
                 httpOnly: true, 
                 path:'/'});
  }
  next();
});

app.use("/articles", ArticleRoutes);

app.use((error, req, res, next) => {
  console.log("An Error has been thrown!")
  res.status(500).json({message:error.message});
});

app.post("/", (req, res) =>{
  res.cookie('hasVisited', req.body.Username, { 
    maxAge: 60*60*1000, 
    httpOnly: true, 
    path:'/'
  });
  fs.readFile(mainPagePath, function (err, html) {
    if (err) {
      res.writeHead(404);
      res.end("404 Not Found: " + JSON.stringify(err));
      return; 
    }
    let htmlStr = html.toString();
    let loggedArr = htmlStr.split('dummyUser');
    let loggedHTML = loggedArr[0] + req.body.Username +loggedArr[1];    
    res.writeHeader(200, {"Content-Type": "text/html"});  
    res.write(loggedHTML);  
    res.end(); 
  });
});

app.get("/", (req, res) =>{
  if (req.cookies.hasVisited === '1'){
    fs.readFile(authPagePath, function (err, html) {
      if (err) {
        res.writeHead(404);
        res.end("404 Not Found: " + JSON.stringify(err));
        return; 
      }    
      res.writeHeader(200, {"Content-Type": "text/html"});  
      res.write(html);  
      res.end(); 
    });
  }else{
    fs.readFile(mainPagePath, function (err, html) {
      if (err) {
        res.writeHead(404);
        res.end("404 Not Found: " + JSON.stringify(err));
        return; 
      }
      let htmlStr = html.toString();
      let loggedArr = htmlStr.split('dummyUser');
      let loggedHTML = loggedArr[0] + req.cookies.hasVisited +loggedArr[1];    
      res.writeHeader(200, {"Content-Type": "text/html"});  
      res.write(loggedHTML);
      res.end(); 
    });
  }
});

module.exports = app;