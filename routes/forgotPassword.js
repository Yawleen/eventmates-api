const express = require("express");
const router = express.Router();
const { sendEmail } = require("../controllers/forgotPassword");

router.post("/", sendEmail);

module.exports = router;
