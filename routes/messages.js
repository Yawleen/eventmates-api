const express = require('express');
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { getGroupMessages } = require('../controllers/messages');


router.get('/', getGroupMessages);
// auth

module.exports = router;