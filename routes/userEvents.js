const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { addUserEvent } = require("../controllers/userEvents");

router.post("/", authenticate, addUserEvent);

module.exports = router;
