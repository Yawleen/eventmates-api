const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { isUserOnline } = require("../controllers/auth");

router.post("/", authenticate, isUserOnline);

module.exports = router;
