'use strict'
const fs = require('fs');
const url = require('url').URL;
const newsPath = './rawdata3/news.json';
const publicPagePath = './rawdata3/publicPage.html';

let news, articles, rawdata;

function getPublicArticles(){
  rawdata = fs.readFileSync(newsPath);
  news = JSON.parse(rawdata);
  articles = news.NEWS.ARTICLE;
  articles = articles.filter(function(filtered){
    return (filtered.PUBLIC).includes("T");
  });
  return articles;
}

function addUserCookie(html, username, role){
  let htmlStr = html.toString();
  let loggedArr = htmlStr.split('dummyUser');
  htmlStr = loggedArr[0] + username +loggedArr[1];

  loggedArr = htmlStr.split('dummyRole');
  htmlStr = loggedArr[0] + role +loggedArr[1];
  return htmlStr;  
}

function buildPublicHTML(jsonData, html, urlObj, username, role){
  let htmlStr = addUserCookie(html, username, role);    

  let htmlArr = htmlStr.split("<br /><br /><br /><br /><br /><br /><br />");
  let newHTML = htmlArr[0];
  let titleFilter = urlObj.searchParams.get("TITLE");
  let authorFilter = urlObj.searchParams.get("AUTHOR");
  let dateFilter = urlObj.searchParams.get("DATE");

  if(titleFilter !=="" && titleFilter !== null){
    jsonData = jsonData.filter(function(filtered){
      return (filtered.TITLE).includes(titleFilter);
    });
  }
  if(authorFilter !=="" && authorFilter !== null){
    jsonData = jsonData.filter(function(filtered){
      return (filtered.AUTHOR).includes(authorFilter);
    });
  }
  if(dateFilter !=="" && dateFilter !== null){
    jsonData = jsonData.filter(function(filtered){
      return (filtered.DATE).includes(dateFilter);
    });
  }

  newHTML = newHTML + '<form action="articles/public" method="get"><table border=1 cols=4><tr><th>Title</th><th>Author</th><th>Date</th><th>Content</th></tr>';

  if(jsonData.length > 0){
    for(var i in jsonData){
      newHTML = newHTML + 
      "<tr>"+
      "<td>"+jsonData[i].TITLE+"</td>"+
      "<td>"+jsonData[i].AUTHOR+"</td>"+
      "<td>"+jsonData[i].DATE+"</td>"+
      "<td>"+jsonData[i].CONTENT+"</td>"+
      "</tr>";
    }
  }else{
    newHTML = newHTML + 
    "<tr>"+
    "<td>No Articles!</td>"+
    "</tr>";
  }

  newHTML = newHTML + '</table>' + htmlArr[1];
  return newHTML;
}

exports.getArticles = async (req, res, next) =>{
  let urlObj = new url(req.url, "http://localhost:3002/");

  try{
    if(req.headers.accept === 'application/json'){
      res.status(200).json(articles);
    }else{
      fs.readFile(publicPagePath, function (err, html) {
        if (err) {
          res.writeHead(404);
          res.end("404 Not Found: " + JSON.stringify(err));
          return; 
        }
        let articles = getPublicArticles();
        
        let articlesPage = buildPublicHTML(articles, html, urlObj, req.cookies.hasVisited, req.cookies.Role);
        res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write(articlesPage);  
        res.end(); 
      });
    }
  }catch(err){
    next(err);
  }
};
