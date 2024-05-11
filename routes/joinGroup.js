const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { joinEventGroup } = require("../controllers/eventGroups");

router.post("/", authenticate, joinEventGroup);

module.exports = router;
