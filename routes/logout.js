const express = require('express');
const router = express.Router();

const { authenticate } = require('../middlewares/auth');
const { logout } = require('../controllers/logout');

router.get('/', authenticate, logout);

module.exports = router;