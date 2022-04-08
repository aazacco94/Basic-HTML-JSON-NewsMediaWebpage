'use strict'
const fs = require('fs');
let newsPath = './news.json';
let news, articles, filteredArt, jsonObj, rawdata;

rawdata = fs.readFileSync(newsPath);
news = JSON.parse(rawdata);
articles = news.NEWS.ARTICLE;
filteredArt = articles;

async function updateArticles(){
  news.NEWS.ARTICLE = articles;
  let newsStr = JSON.stringify(news, null, 4);
  await fs.writeFile(newsPath, newsStr, (err) => {
    if(err) {
      console.log(err);
      next(err);
    } else console.log('File has been updated!');
  });
}

exports.createArticle = async (req, res, next) => {
  try{
    const article = req.body;
    articles.push(article);
    filteredArt = articles
    updateArticles();
    res.status(200).json(articles);
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
    let artNum = req.params.articleId;
    let article = articles[artNum];
    res.status(200).json(article);
  }catch(err){
    next(err);
  }
};

exports.updateArticle = async (req, res, next) =>{
  try{
    let artNum = req.params.articleId;
    let updatedArt = req.body;
    articles[artNum] = updatedArt;
    updateArticles();
    res.status(200).json(updatedArt);
  }catch(err){
    next(err);
  }
};

exports.deleteArticle = async (req, res, next) =>{
  try{
    let artNum = req.params.articleId;
    articles[artNum] = "";
    articles = articles.filter(x => x !== "");
    updateArticles();
    res.status(200).json(articles);
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