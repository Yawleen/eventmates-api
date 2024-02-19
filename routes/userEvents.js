const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { addUserEvent, deleteUserEvent } = require("../controllers/userEvents");

router.post("/", authenticate, addUserEvent);
router.delete("/", authenticate, deleteUserEvent);

module.exports = router;
