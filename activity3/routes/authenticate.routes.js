const express = require("express");
const AuthenticateController = require("../controllers/authenticate.controller");
const router = express.Router();

router.get("/", AuthenticateController.getLogin);

module.exports = router;