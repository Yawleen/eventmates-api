const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { isUserInGroup } = require("../controllers/eventGroups");

router.get("/", authenticate, isUserInGroup);

module.exports = router;
