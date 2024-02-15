const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { getGenres } = require("../controllers/genres");

router.get("/", authenticate, getGenres);

module.exports = router;
