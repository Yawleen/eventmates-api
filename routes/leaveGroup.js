const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { leaveEventGroup } = require("../controllers/eventGroups");

router.post("/", authenticate, leaveEventGroup);

module.exports = router;
