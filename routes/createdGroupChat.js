const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { getCreatedGroupChat } = require("../controllers/groupChat");

router.get("/", authenticate, getCreatedGroupChat);

module.exports = router;
