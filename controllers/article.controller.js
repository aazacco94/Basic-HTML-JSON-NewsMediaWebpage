const ArticleModel = require("../models/article.model");

exports.createArticle = async (req, res, next) => {
  const article = req.body;

  try{
    const createdArticle = new ArticleModel({
      title: article.title,
      author: article.author,
      date: article.date,
      public: article.public,
      content: article.content
    }) 
    createdArticle.save();
    res.status(201).json(createdArticle);
  }catch(err){
    next(err);
  }
};

exports.getArticles = async (req, res, next) =>{
  try{
    const allarticles = await ArticleModel.find({});
    res.status(200).json(allarticles);
  }catch(err){
    next(err);
  }
};

exports.getArticleById = async (req, res, next) =>{
  try{
    const article = await ArticleModel.findById(req.params.articleId);
    if(article){
      res.status(200).json(article);
    } else {
      res.status(404).send();
    }
  }catch(err){
    next(err);
  }
};

exports.updateArticle = async (req, res, next) =>{
  try{
    const updatedArticle = await ArticleModel.findByIdAndUpdate(req.params.articleId, req.body, {
      new: true,
      useFindAndModify: false
    });
    if(updatedArticle){
      res.status(200).json(updatedArticle);
    } else {
      res.status(404).send();
    }
  }catch(err){
    next(err);
  }
};

exports.deleteArticle = async (req, res, next) =>{
  try{
    const article = await ArticleModel.findByIdAndDelete(req.params.articleId);
    if(article){
      res.status(200).json(article);
    } else {
      res.status(404).send();
    }
  }catch(err){
    next(err);
  }
};