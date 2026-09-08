const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SpotifyUser",
        required: true
    },
    tracks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "music"
    }]
}, { timestamps: true });

const playlistModel = mongoose.model("Playlist", playlistSchema);

module.exports = playlistModel;
