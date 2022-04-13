const express = require("express");
const ArticleController = require("../controllers/article.controller");
const router = express.Router();

router.post("/", ArticleController.createArticle);

router.get("/", ArticleController.getArticles);

router.get("/:articleId", ArticleController.getArticleById);

router.put("/:articleId", ArticleController.updateArticle);

router.delete("/:articleId", ArticleController.deleteArticle);

module.exports = router;