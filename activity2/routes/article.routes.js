const express = require("express");
const ArticleController = require("../controllers/article.controller");
const router = express.Router();


router.get("/", ArticleController.getArticles);

router.get("/edit", ArticleController.editArticle);

router.get("/add", ArticleController.createArticle);

router.get("/:articleId", ArticleController.getArticleById);

router.put("/:articleId", ArticleController.updateArticle);

router.delete("/:articleId", ArticleController.deleteArticle);

module.exports = router;