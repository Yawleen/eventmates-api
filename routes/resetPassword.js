const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { resetPassword } = require("../controllers/resetPassword");

router.post("/", authenticate, resetPassword);

module.exports = router;
