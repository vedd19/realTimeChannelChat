const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')

module.exports.authMiddleware = async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            "success": false,
            "message": "unauthorized bhai"
        })
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded._id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Bad token, cannot find user"
            });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token",
            error: err
        });
    }
}