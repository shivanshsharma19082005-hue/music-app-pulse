const express = require('express');
const router = express.Router();
const controller = require('../controller/music.controller');
const likeController = require('../controller/like.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// Liked-music route must come before "/:id" so "liked" isn't treated as an id
router.get('/liked/me', authMiddleware, likeController.getMyLikedMusic);

router.post('/', authMiddleware, requireRole('artist'), controller.createMusic);
router.get('/', controller.getAllMusic);
router.get('/:id', controller.getMusicById);
router.post('/:id/like', authMiddleware, likeController.toggleLike);

module.exports = router;
