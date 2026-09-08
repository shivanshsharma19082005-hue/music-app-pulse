const Usermodel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}

async function registerUser(req, res) {

    const { username, password, email, role = 'user' } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({
            message: "username, email and password are required"
        });
    }

    const isUserAlreadyExisted = await Usermodel.findOne({
        $or: [{ username }, { email }]
    });

    if (isUserAlreadyExisted) {
        return res.status(409).json({
            message: "user already existed"
        })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await Usermodel.create({
        username,
        email,
        password: hashPassword,
        role
    });

    const token = jwt.sign({
        id: user._id,
        role: user.role,
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie('token', token, COOKIE_OPTIONS)

    res.status(201).json({
        message: "User Created Successfully",
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}

async function loginUser(req, res) {

    const { username, email, password } = req.body

    if (!password || (!username && !email)) {
        return res.status(400).json({
            message: "username or email, and password are required"
        });
    }

    const user = await Usermodel.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (!user) {
        return res.status(409).json({
            message: "Invalid Cridential"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(409).json({
            message: "password is not valid"
        })
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role,
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie("token", token, COOKIE_OPTIONS)

    res.status(200).json({
        message: "user login successfully",
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}

async function logoutUser(req, res) {
    res.clearCookie('token', COOKIE_OPTIONS);
    res.status(200).json({
        message: "Logged out successfully"
    })
}

// GET /api/auth/me -> returns the currently logged-in user (used to restore
// a session on page refresh, since the JWT lives in an httpOnly cookie that
// client-side JS can't read directly).
async function getMe(req, res) {
    try {
        const user = await Usermodel.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err.message
        });
    }
}

module.exports = { registerUser, loginUser, logoutUser, getMe }
