const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');

module.exports = async function (req, res, next) {
    const token = req.cookies.token;
    if(!token) {
        req.flash('error', "You need to login first");
        return res.redirect('/');
    }

    try {
        let decoded = jwt.verify(token, process.env.JWT_KEY);
        let user = await userModel
            .findOne({ email: decoded.email })
            .select("-password");

        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        next();
    } catch(err) {
        req.flash("error", "Invalid or expired token");
        res.clearCookie("token");
        res.redirect('/');
    }
};