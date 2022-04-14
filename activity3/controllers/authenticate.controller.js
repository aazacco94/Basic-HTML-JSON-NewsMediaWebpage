'use strict'
const fs = require('fs');
const url = require('url').URL;

const authPagePath = './rawdata3/authPage.html';

exports.getLogin = async (req, res, next) =>{
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
}
