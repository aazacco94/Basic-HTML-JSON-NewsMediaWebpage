const express = require("express");
const PublicController = require("../controllers/public.controller");
const router = express.Router();

router.get("/", PublicController.getArticles);

module.exports = router;