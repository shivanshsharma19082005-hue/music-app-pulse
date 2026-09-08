const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized user"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized user"
        });
    }
}

function requireRole(role) {
    return function (req, res, next) {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({
                message: `Only ${role}s can perform this action`
            });
        }
        next();
    };
}

module.exports = { authMiddleware, requireRole };
