const express = require('express');
const router = express.Router();
const controller = require('../controller/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.post('/register', controller.registerUser);
router.post('/login', controller.loginUser);
router.post('/logout', controller.logoutUser);
router.get('/me', authMiddleware, controller.getMe);

module.exports = router;
