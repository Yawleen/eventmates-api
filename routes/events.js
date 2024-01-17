const express = require('express');
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { getEvents } = require('../controllers/events');


router.get('/', authenticate, getEvents);

module.exports = router;