const express = require('express');
const router = express.Router();
const controller = require('../controller/playlist.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.post('/', authMiddleware, controller.createPlaylist);
router.get('/', authMiddleware, controller.getMyPlaylists);
router.get('/:id', authMiddleware, controller.getPlaylistById);
router.post('/:id/tracks', authMiddleware, controller.addTrack);
router.delete('/:id/tracks/:musicId', authMiddleware, controller.removeTrack);
router.delete('/:id', authMiddleware, controller.deletePlaylist);

module.exports = router;
