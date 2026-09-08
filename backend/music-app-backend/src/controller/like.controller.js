const likeModel = require('../models/like.model');
const musicModel = require('../models/music.model');

// POST /api/music/:id/like -> toggles like/unlike for the current user
async function toggleLike(req, res) {
    try {
        const musicId = req.params.id;
        const userId = req.user.id;

        const music = await musicModel.findById(musicId);
        if (!music) {
            return res.status(404).json({
                message: "Music not found"
            });
        }

        const existingLike = await likeModel.findOne({ user: userId, music: musicId });

        if (existingLike) {
            await existingLike.deleteOne();
            const likeCount = await likeModel.countDocuments({ music: musicId });
            return res.status(200).json({
                message: "Music unliked",
                liked: false,
                likeCount
            });
        }

        await likeModel.create({ user: userId, music: musicId });
        const likeCount = await likeModel.countDocuments({ music: musicId });

        return res.status(201).json({
            message: "Music liked",
            liked: true,
            likeCount
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong while toggling like",
            error: err.message
        });
    }
}

// GET /api/music/liked/me -> all tracks the current user has liked
async function getMyLikedMusic(req, res) {
    try {
        const likes = await likeModel.find({ user: req.user.id })
            .populate({
                path: 'music',
                populate: { path: 'artist', select: 'username email role' }
            })
            .sort({ createdAt: -1 });

        const music = likes.map(like => like.music).filter(Boolean);

        return res.status(200).json({ music });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong while fetching liked music",
            error: err.message
        });
    }
}

module.exports = { toggleLike, getMyLikedMusic };
