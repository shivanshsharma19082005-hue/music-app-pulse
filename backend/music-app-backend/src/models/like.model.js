const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SpotifyUser",
        required: true
    },
    music: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "music",
        required: true
    }
}, { timestamps: true });

// Prevent the same user from liking the same track more than once
likeSchema.index({ user: 1, music: 1 }, { unique: true });

const likeModel = mongoose.model("Like", likeSchema);

module.exports = likeModel;
