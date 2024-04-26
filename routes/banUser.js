const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { banUser } = require("../controllers/eventGroups");

router.post("/", authenticate, banUser);

module.exports = router;
