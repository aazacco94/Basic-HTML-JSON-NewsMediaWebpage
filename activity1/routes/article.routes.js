const express = require("express");
const ArticleController = require("../controllers/article.controller");
const router = express.Router();

router.post("/", ArticleController.createArticle);

router.get("/", ArticleController.getArticles);

router.get("/filterDate/", ArticleController.filterByDateRange);

router.get("/filterTitle/", ArticleController.filterByTitle);

router.get("/filterAuthor/", ArticleController.filterByAuthor);

router.get("/:articleId", ArticleController.getArticleById);

router.put("/:articleId", ArticleController.updateArticle);

router.delete("/:articleId", ArticleController.deleteArticle);

module.exports = router;