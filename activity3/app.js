const express = require("express");
const ArticleRoutes = require("./routes/article.routes");
const PublicRoutes = require("./routes/public.routes");
const AuthenticateRoutes = require("./routes/authenticate.routes");
const fs = require('fs');
const mainPagePath = './rawdata3/mainpage.html';
const authPagePath = './rawdata3/authPage.html';
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function addUserCookie(html, username, role){
  let htmlStr = html.toString();
  let loggedArr;
  if(role == 'Reporter' || role == 'Admin'){
    loggedArr = htmlStr.split('Welcome dummyUser,');
    htmlStr = loggedArr[0] + `<a href="/auth">Welcome ${username},</a>`+loggedArr[1];
  } else if(role === 'Subscriber'){
    loggedArr = htmlStr.split('Welcome dummyUser,');
    htmlStr = loggedArr[0] + `<a href="/auth">Welcome ${username},</a>`+loggedArr[1];

    loggedArr = htmlStr.split('<a href="/articles">NEWS ARCHIVE</a>')
    htmlStr = loggedArr[0]+loggedArr[1];
  } else {
    loggedArr = htmlStr.split('Welcome dummyUser,');
    htmlStr = loggedArr[0] + `<a href="/auth">Switch Account,</a>`+loggedArr[1];

    loggedArr = htmlStr.split('<a href="/articles">NEWS ARCHIVE</a>')
    htmlStr = loggedArr[0]+loggedArr[1];
  }

  loggedArr = htmlStr.split('dummyRole');
  htmlStr = loggedArr[0] + role +loggedArr[1];

  return htmlStr;  
}

app.use('/', function(req, res, next){
  if (!req.cookies.hasVisited){
    res.cookie('hasVisited', '1', 
               { maxAge: 60*60*1000, 
                 httpOnly: true, 
                 path:'/'});
    res.cookie('Role', '1', 
    { maxAge: 60*60*1000, 
      httpOnly: true, 
      path:'/'});
  }
  next();
});

app.use("/articles", ArticleRoutes);
app.use("/public", PublicRoutes);
app.use("/auth", AuthenticateRoutes);

app.use((error, req, res, next) => {
  console.log("An Error has been thrown!")
  res.status(500).json({message:error.message});
});

app.post("/", (req, res) =>{
  let username = req.body.Username;
  let role = req.body.Role;
  res.cookie('hasVisited', username, { 
    maxAge: 60*60*1000, 
    httpOnly: true, 
    path:'/'
  });
  res.cookie('Role', role, { 
    maxAge: 60*60*1000, 
    httpOnly: true, 
    path:'/'
  });
  console.log(`- ${username} has logged in.`)
  fs.readFile(mainPagePath, function (err, html) {
    if (err) {
      res.writeHead(404);
      res.end("404 Not Found: " + JSON.stringify(err));
      return; 
    }
    let htmlStr = addUserCookie(html, req.cookies.hasVisited, req.cookies.Role)   
    res.writeHeader(200, {"Content-Type": "text/html"});  
    res.write(htmlStr);  
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
      let htmlStr = addUserCookie(html, req.cookies.hasVisited, req.cookies.Role)   
      console.log(`- ${req.cookies.hasVisited} has returned to home page.`);
      res.writeHeader(200, {"Content-Type": "text/html"});  
      res.write(htmlStr);
      res.end(); 
    });
  }
});

module.exports = app;