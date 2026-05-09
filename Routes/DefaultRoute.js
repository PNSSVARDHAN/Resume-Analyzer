const express = require("express");
const Home = require("../Controllers/DefaultController");

router = express.Router();

router.get("/",Home);

module.exports = router