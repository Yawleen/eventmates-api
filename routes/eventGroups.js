const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { addEventGroup } = require("../controllers/eventGroups");

router.post("/", authenticate, addEventGroup);

module.exports = router;
