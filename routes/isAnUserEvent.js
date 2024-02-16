const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { isAnUserEvent } = require("../controllers/userEvents");

router.get("/", authenticate, isAnUserEvent);

module.exports = router;
