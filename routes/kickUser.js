const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { kickUser } = require("../controllers/eventGroups");

router.post("/", authenticate, kickUser);

module.exports = router;
