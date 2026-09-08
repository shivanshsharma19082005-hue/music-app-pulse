const playlistModel = require('../models/playlist.model');
const musicModel = require('../models/music.model');

async function createPlaylist(req, res) {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "name is required"
        });
    }

    try {
        const playlist = await playlistModel.create({
            name,
            description,
            owner: req.user.id,
            tracks: []
        });

        return res.status(201).json({
            message: "Playlist created successfully",
            playlist
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong while creating the playlist",
            error: err.message
        });
    }
}

// GET /api/playlist -> playlists owned by the current user
async function getMyPlaylists(req, res) {
    try {
        const playlists = await playlistModel.find({ owner: req.user.id })
            .sort({ createdAt: -1 });

        return res.status(200).json({ playlists });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong while fetching playlists",
            error: err.message
        });
    }
}

async function getPlaylistById(req, res) {
    try {
        const playlist = await playlistModel.findById(req.params.id)
            .populate({
                path: 'tracks',
                populate: { path: 'artist', select: 'username email role' }
            })
            .populate('owner', 'username email');

        if (!playlist) {
            return res.status(404).json({
                message: "Playlist not found"
            });
        }

        return res.status(200).json({ playlist });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong while fetching the playlist",
            error: err.message
        });
    }
}

async function addTrack(req, res) {
    try {
        const { musicId } = req.body;

        if (!musicId) {
            return res.status(400).json({
                message: "musicId is required"
            });
        }

        const playlist = await playlistModel.findById(req.params.id);
        if (!playlist) {
            return res.status(404).json({
                message: "Playlist not found"
            });
        }

        if (playlist.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You do not own this playlist"
            });
        }

        const music = await musicModel.findById(musicId);
        if (!music) {
            return res.status(404).json({
                message: "Music not found"
            });
        }

        if (playlist.tracks.some(t => t.toString() === musicId)) {
            return res.status(409).json({
                message: "Track already in playlist"
            });
        }

        playlist.tracks.push(musicId);
        await playlist.save();

        return res.status(200).json({
            message: "Track added to playlist",
            playlist
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong while adding the track",
            error: err.message
        });
    }
}

async function removeTrack(req, res) {
    try {
        const { id, musicId } = req.params;

        const playlist = await playlistModel.findById(id);
        if (!playlist) {
            return res.status(404).json({
                message: "Playlist not found"
            });
        }

        if (playlist.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You do not own this playlist"
            });
        }

        playlist.tracks = playlist.tracks.filter(t => t.toString() !== musicId);
        await playlist.save();

        return res.status(200).json({
            message: "Track removed from playlist",
            playlist
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong while removing the track",
            error: err.message
        });
    }
}

async function deletePlaylist(req, res) {
    try {
        const playlist = await playlistModel.findById(req.params.id);
        if (!playlist) {
            return res.status(404).json({
                message: "Playlist not found"
            });
        }

        if (playlist.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You do not own this playlist"
            });
        }

        await playlist.deleteOne();

        return res.status(200).json({
            message: "Playlist deleted successfully"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong while deleting the playlist",
            error: err.message
        });
    }
}

module.exports = {
    createPlaylist,
    getMyPlaylists,
    getPlaylistById,
    addTrack,
    removeTrack,
    deletePlaylist
};
