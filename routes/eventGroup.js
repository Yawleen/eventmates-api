const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { getEventGroup } = require("../controllers/eventGroups");

router.get("/", authenticate, getEventGroup);

module.exports = router;
