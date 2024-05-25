const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { getJoinedGroupChat } = require("../controllers/groupChat");

router.get("/", authenticate, getJoinedGroupChat);

module.exports = router;
