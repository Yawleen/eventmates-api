const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { addEventGroup, getEventGroups } = require("../controllers/eventGroups");

router.post("/", authenticate, addEventGroup);
router.get("/", authenticate, getEventGroups);

module.exports = router;
