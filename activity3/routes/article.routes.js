const express = require("express");
const ArticleController = require("../controllers/article.controller");
const router = express.Router();

router.get("/", ArticleController.getArticles);

router.post("/edit", ArticleController.updateArticle);

router.get("/edit", ArticleController.editArticle);

router.get("/add", ArticleController.addArticlePage);

router.post("/add", ArticleController.createArticle);

router.get("/delete", ArticleController.deleteArticles);

module.exports = router;