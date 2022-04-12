'use strict'
const fs = require('fs');
const url = require('url').URL;
const newsPath = './rawdata/news.json';
const articlesPagePath = './rawdata/articlespage.html';
const editPagePath = './rawdata/editArticlesPage.html';
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

function buildEditHTML(jsonData, html, artNum){
  let htmlStr = html.toString();
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

  newHTML = testHTML;

  newHTML = newHTML + '<form action="/articles/edit" method="get"><table border=1 cols=5><tr><th>Select</th><th>Title</th><th>Author</th><th>Date</th><th>Content</th></tr>';

  if(jsonData.length > 0){
    for(var i in jsonData){
      newHTML = newHTML + 
      "<tr>"+
      '<td><input type="radio" id="'+i+'" name="articleRadio" value="'+i+'"/></td>'+
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

  newHTML = newHTML + '</table><input type="submit" value="Edit Article"></form><span><a href="/articles/add">Add More</a></span><br><br>' + htmlArr[1];
  return newHTML;
}

function buildArticlesHTML(jsonData, html){
  let htmlStr = html.toString();
  let htmlArr = htmlStr.split("<br /><br /><br /><br /><br /><br /><br />");
  let newHTML = htmlArr[0];

  newHTML = newHTML + '<form action="articles/edit" method="get"><table border=1 cols=5><tr><th>Select</th><th>Title</th><th>Author</th><th>Date</th><th>Content</th></tr>';

  if(jsonData.length > 0){
    for(var i in jsonData){
      newHTML = newHTML + 
      "<tr>"+
      '<td><input type="radio" id="'+i+'" name="articleRadio" value="'+i+'"/></td>'+
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

  newHTML = newHTML + '</table><input type="submit" value="Edit Article"></form><span><a href="/articles/add">Add More</a></span><br><br>' + htmlArr[1];
  return newHTML;
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
        articles.push(article);
        filteredArt = articles
        updateArticles();
        res.status(200).json(articles);
      }else{
        res.status(400).json({message:"All fields are required to create an Article!"})
      }
  }catch(err){
    next(err);
  }
};

exports.getArticles = async (req, res, next) =>{
  filteredArt = articles
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
        
        let articlesPage = buildArticlesHTML(articles, html);
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
  let artNum = urlObj.searchParams.get("articleRadio")
  try{
    if(req.headers.accept === 'application/json'){
      res.status(200).json(articles);
    }else{
      fs.readFile(editPagePath, function (err, html) {
        if (err) {
          res.writeHead(404);
          res.end("404 Not Found: " + JSON.stringify(err));
          return; 
        }
        
        let articlesPage = buildEditHTML(articles, html, artNum);
        res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write(articlesPage);  
        res.end(); 
      });
    }
  }catch(err){
    next(err);
  }
};

exports.getArticleById = async (req, res, next) =>{
  try{
    if(req.params.articleId < articles.length && req.params.articleId > 0){
      let artNum = req.params.articleId;
      let article = articles[artNum];
      res.status(200).json(article);
    }else{
      res.status(404).json({message:"Not a correct Article Number!"})
    }
  }catch(err){
    next(err);
  }
};

exports.updateArticle = async (req, res, next) =>{
  try{
    if(req.params.articleId < articles.length && req.params.articleId > 0){
      if(
        req.body.TITLE != undefined &&
        req.body.AUTHOR != undefined &&
        req.body.DATE != undefined &&
        req.body.PUBLIC != undefined &&
        req.body.CONTENT != undefined){
          let artNum = req.params.articleId;
          let updatedArt = req.body;
          articles[artNum] = updatedArt;
          updateArticles();
          res.status(200).json(updatedArt);
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

exports.deleteArticle = async (req, res, next) =>{
  try{
    if(req.params.articleId < articles.length && req.params.articleId > 0){
      let artNum = req.params.articleId;
      articles[artNum] = "";
      articles = articles.filter(x => x !== "");
      updateArticles();
      res.status(200).json(articles);
    }else{
      res.status(404).json({message:"Not a correct Article Number!"})
    }
  }catch(err){
    next(err);
  }
};

exports.filterByDateRange = async (req, res, next) =>{
  try{
    let start = req.body.start;
    let end = req.body.end;
    let startDate = new Date(start);
    let endDate = new Date(end);
    let dateStr;
    let tempArt = [];
    let i = 0;
    for(var x in filteredArt){
      dateStr = filteredArt[x].DATE;
      let date = new Date(dateStr);
      if(date >= startDate && date <= endDate){
        tempArt[i] = filteredArt[x];
        i=i+1;
      }
    }
    filteredArt = tempArt
    res.status(200).json(filteredArt);
  }catch(err){
    next(err);
  }
};

exports.filterByTitle = async (req, res, next) =>{
  try{
    let filter = req.body.filter;
    filteredArt = filteredArt.filter(x => x.TITLE.includes(filter));
    res.status(200).json(filteredArt);
  }catch(err){
    next(err);
  }
};

exports.filterByAuthor = async (req, res, next) =>{
  try{
    let filter = req.body.filter;
    filteredArt = filteredArt.filter(x => x.AUTHOR.includes(filter));
    res.status(200).json(filteredArt);
  }catch(err){
    next(err);
  }
};