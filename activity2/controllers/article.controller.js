'use strict'
const fs = require('fs');
const url = require('url').URL;
const newsPath = './rawdata/news.json';
const articlesPagePath = './rawdata/articlespage.html';
const editPagePath = './rawdata/editArticlesPage.html';
const addPagePath = './rawdata/addArticlePage.html';
const deletePagePath = './rawdata/deleteArticlesPage.html';
let news, articles, filteredArt, rawdata;

rawdata = fs.readFileSync(newsPath);
news = JSON.parse(rawdata);
articles = news.NEWS.ARTICLE;
filteredArt = articles;

async function updateArticles(){
  news.NEWS.ARTICLE = articles;
  let newsStr = JSON.stringify(news, null, 4);

  try{
    fs.writeFileSync(newsPath, newsStr);
    console.log('File has been updated!');
  }catch(err){
    next(err);
  }
}

function getStoredArticles(){
  rawdata = fs.readFileSync(newsPath);
  news = JSON.parse(rawdata);
  articles = news.NEWS.ARTICLE;
  filteredArt = articles;
  return articles;
}

function addUserCookie(html, username){
  let htmlStr = html.toString();
  let loggedArr = htmlStr.split('dummyUser');
  htmlStr = loggedArr[0] + username +loggedArr[1];
  return htmlStr;  
}

function buildEditHTML(jsonData, html, artNum, username){
  let htmlStr = addUserCookie(html, username);    

  let htmlArr = htmlStr.split("<br /><br /><br /><br /><br /><br /><br />");
  let newHTML = htmlArr[0];
  let articles = getStoredArticles();
  let article = articles[artNum];

  let editHtml = newHTML.split('dummyValue');

  let testHTML = editHtml[0] + article.TITLE+
                 editHtml[1] + article.AUTHOR+
                 editHtml[2] + article.DATE+
                 editHtml[3] + article.PUBLIC+
                 editHtml[4] + article.CONTENT + editHtml[5];

  testHTML = testHTML + artNum+editHtml[6];

  newHTML = testHTML;

  newHTML = newHTML + '<form action="edit" method="get"><table border=1 cols=5><tr><th>Select</th><th>Title</th><th>Author</th><th>Date</th><th>Content</th></tr>';

  if(jsonData.length > 0){
    for(var i in jsonData){
      newHTML = newHTML + 
      "<tr>"+
      '<td><input type="radio" id="'+jsonData[i].id+'" name="articleRadio" value="'+jsonData[i].id+'"/></td>'+
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

  newHTML = newHTML + '</table><input type="submit" value="Edit Article"></form><br><br><span><a href="/articles/add">Add Articles</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="/articles/delete">Delete Articles</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="/articles?">Search Articles</a></span><br><br>' + htmlArr[1];
  return newHTML;
}

function buildAddHTML(jsonData, html, username){
  let htmlStr = addUserCookie(html, username);     

  let htmlArr = htmlStr.split("<br /><br /><br /><br /><br /><br /><br />");
  let newHTML = htmlArr[0];

  newHTML = newHTML + '<form action="edit" method="get"><table border=1 cols=5><tr><th>Select</th><th>Title</th><th>Author</th><th>Date</th><th>Content</th></tr>';

  if(jsonData.length > 0){
    for(var i in jsonData){
      newHTML = newHTML + 
      "<tr>"+
      '<td><input type="radio" id="'+jsonData[i].id+'" name="articleRadio" value="'+jsonData[i].id+'"/></td>'+
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

  newHTML = newHTML + '</table><input type="submit" value="Edit Article"></form><br><br><span><a href="/articles/delete">Delete Articles</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="/articles?">Search Articles</a></span><br><br>' + htmlArr[1];
  return newHTML;
}

function buildArticlesHTML(jsonData, html, urlObj, username){
  let htmlStr = addUserCookie(html, username);    

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

  newHTML = newHTML + '<form action="articles/edit" method="get"><table border=1 cols=5><tr><th>Select</th><th>Title</th><th>Author</th><th>Date</th><th>Content</th></tr>';

  if(jsonData.length > 0){
    for(var i in jsonData){
      newHTML = newHTML + 
      "<tr>"+
      '<td><input type="radio" id="'+jsonData[i].id+'" name="articleRadio" value="'+jsonData[i].id+'"/></td>'+
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

  newHTML = newHTML + '</table><input type="submit" value="Edit Article"></form><br><br><span><a href="/articles/add">Add Articles</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="/articles/delete">Delete Articles</a></span><br><br>' + htmlArr[1];
  return newHTML;
}

function buildDeletePageHTML(jsonData, html, urlObj, username){
  let htmlStr = addUserCookie(html, username);    

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

  newHTML = newHTML + '<form action="delete" method="get"><table border=1 cols=5><tr><th>Select</th><th>Title</th><th>Author</th><th>Date</th><th>Content</th></tr>';

  if(jsonData.length > 0){
    for(var i in jsonData){
      newHTML = newHTML + 
      "<tr>"+
      '<td><input type="radio" id="'+jsonData[i].id+'" name="articleRadio" value="'+jsonData[i].id+'"/></td>'+
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

  newHTML = newHTML + '</table><input type="submit" value="Delete Article"></form><br><br><span><a href="/articles/add">Add Articles</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="/articles/edit?">Edit Articles</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="/articles">Search Articles</a></span><br><br>' + htmlArr[1];
  return newHTML;
}

exports.addArticlePage = async (req, res, next) => {
  try{
    fs.readFile(addPagePath, function (err, html) {
      if (err) {
        res.writeHead(404);
        res.end("404 Not Found: " + JSON.stringify(err));
        return; 
      }
      
      let articlesPage = buildAddHTML(articles, html, req.cookies.hasVisited);
      res.writeHeader(200, {"Content-Type": "text/html"});  
      res.write(articlesPage);  
      res.end(); 
    });
  }catch(err){
    next(err);
  }
}

exports.createArticle = async (req, res, next) => {
  try{
    if(
      req.body.TITLE != undefined &&
      req.body.AUTHOR != undefined &&
      req.body.DATE != undefined &&
      req.body.PUBLIC != undefined &&
      req.body.CONTENT != undefined){
        const article = req.body;
        article.id = articles.length;
        console.log("New Article: "+ article);
        articles.push(article);
        filteredArt = articles
        updateArticles();
        if(req.headers.accept === 'application/json'){
          res.status(200).json(articles);
        }else{
          fs.readFile(addPagePath, function (err, html) {
            if (err) {
              res.writeHead(404);
              res.end("404 Not Found: " + JSON.stringify(err));
              return; 
            }
            
            let articlesPage = buildAddHTML(articles, html, req.cookies.hasVisited);
            res.writeHeader(200, {"Content-Type": "text/html"});  
            res.write(articlesPage);  
            res.end(); 
          });
        }
      }else{
        res.status(400).json({message:"All fields are required to create an Article!"})
      }
  }catch(err){
    next(err);
  }
};

exports.getArticles = async (req, res, next) =>{
  filteredArt = articles
  let urlObj = new url(req.url, "http://localhost:3002/");

  try{
    if(req.headers.accept === 'application/json'){
      res.status(200).json(articles);
    }else{
      fs.readFile(articlesPagePath, function (err, html) {
        if (err) {
          res.writeHead(404);
          res.end("404 Not Found: " + JSON.stringify(err));
          return; 
        }
        
        let articlesPage = buildArticlesHTML(articles, html, urlObj, req.cookies.hasVisited);
        res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write(articlesPage);  
        res.end(); 
      });
    }
  }catch(err){
    next(err);
  }
};

function deleteArticle(artNum){
  articles[artNum] = "";
  articles = articles.filter(function(filtered){
    return filtered !== "";
  })
  updateArticles();
}

exports.deleteArticles = async (req, res, next) =>{
  let urlObj = new url(req.url, "http://localhost:3002/");
  let artNum = urlObj.searchParams.get("articleRadio");
  try{
    deleteArticle(artNum);
    if(req.headers.accept === 'application/json'){
      res.status(200).json(articles);
    }else{
      fs.readFile(deletePagePath, function (err, html) {
        if (err) {
          res.writeHead(404);
          res.end("404 Not Found: " + JSON.stringify(err));
          return; 
        }
        
        let articlesPage = buildDeletePageHTML(articles, html, urlObj, req.cookies.hasVisited);
        res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write(articlesPage);  
        res.end(); 
      });
    }
  }catch(err){
    next(err);
  }
};

exports.editArticle = async (req, res, next) =>{
  filteredArt = articles
  let urlObj = new url(req.url, "http://localhost:3002/");
  let artNum = urlObj.searchParams.get("articleRadio");
  try{
    fs.readFile(editPagePath, function (err, html) {
      if (err) {
        res.writeHead(404);
        res.end("404 Not Found: " + JSON.stringify(err));
        return; 
      }
      console.log("Line 333: " + artNum)
      if(artNum == null){
        artNum = 0;
      }
      
      let articlesPage = buildEditHTML(articles, html, artNum, req.cookies.hasVisited);
      res.writeHeader(200, {"Content-Type": "text/html"});  
      res.write(articlesPage);  
      res.end(); 
    });
  }catch(err){
    next(err);
  }
};

exports.updateArticle = async (req, res, next) =>{
  try{
    let artNum = parseInt(req.body.articleNum)
    if(artNum < articles.length && artNum >= 0){
      if(
        req.body.TITLE != undefined &&
        req.body.AUTHOR != undefined &&
        req.body.DATE != undefined &&
        req.body.PUBLIC != undefined &&
        req.body.CONTENT != undefined){
          let updatedArt = {TITLE:"",AUTHOR:"",DATE:"", PUBLIC:"",CONTENT:"", id:artNum};
          
          updatedArt.TITLE = req.body.TITLE;
          updatedArt.AUTHOR = req.body.AUTHOR;
          updatedArt.DATE = req.body.DATE;
          updatedArt.PUBLIC = req.body.PUBLIC;
          updatedArt.CONTENT = req.body.CONTENT;
          articles[artNum] = updatedArt;
          updateArticles();
          if(req.headers.accept =='application/json'){
            res.status(200).json(updatedArt);
          }else{
            fs.readFile(editPagePath, function (err, html) {
              if (err) {
                res.writeHead(404);
                res.end("404 Not Found: " + JSON.stringify(err));
                return; 
              }

              let articlesPage = buildEditHTML(articles, html, artNum, req.cookies.hasVisited);
              res.writeHeader(200, {"Content-Type": "text/html"});  
              res.write(articlesPage);  
              res.end(); 
            });
          }
        }else{
          res.status(400).json({message:"All fields are required to create an Article!"})
        }
    }else{
      res.status(404).json({message:"Not a correct Article Number!"})
    }
  }catch(err){
    next(err);
  }
};
