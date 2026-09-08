const musicModel = require('../models/music.model');

async function createMusic(req, res) {
    const { uri, title } = req.body;

    if (!uri || !title) {
        return res.status(400).json({
            message: "uri and title are required"
        });
    }

    try {
        const music = await musicModel.create({
            uri,
            title,
            artist: req.user.id
        });

        return res.status(201).json({
            message: "Music created successfully",
            music
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong while creating music",
            error: err.message
        });
    }
}

// GET /api/music?q=<search text>&page=1&limit=10
async function getAllMusic(req, res) {
    try {
        const { q } = req.query;
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
        const skip = (page - 1) * limit;

        const filter = q
            ? { title: { $regex: q, $options: 'i' } }
            : {};

        const [music, total] = await Promise.all([
            musicModel.find(filter)
                .populate('artist', 'username email role')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            musicModel.countDocuments(filter)
        ]);

        return res.status(200).json({
            music,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong while fetching music",
            error: err.message
        });
    }
}

async function getMusicById(req, res) {
    try {
        const music = await musicModel.findById(req.params.id)
            .populate('artist', 'username email role');

        if (!music) {
            return res.status(404).json({
                message: "Music not found"
            });
        }

        return res.status(200).json({ music });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong while fetching music",
            error: err.message
        });
    }
}

module.exports = { createMusic, getAllMusic, getMusicById };
