'use strict'
const fs = require('fs');
let newsPath = './rawdata/news.json';
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
    res.status(200).json(articles);
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
    filteredArt = articles;
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
    let filter = req.body.title;
    filteredArt = articles.filter(x => x.TITLE.includes(filter));
    res.status(200).json(filteredArt);
  }catch(err){
    next(err);
  }
};

exports.filterByAuthor = async (req, res, next) =>{
  try{
    let filter = req.body.author;
    filteredArt = articles.filter(x => x.AUTHOR.includes(filter));
    res.status(200).json(filteredArt);
  }catch(err){
    next(err);
  }
};