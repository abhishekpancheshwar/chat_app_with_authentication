const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

exports.registerUser = async function (req, res) {
    try {
        let { email, password, fullname } = req.body;
        const existingUser = await userModel.findOne({email: email});
        if(existingUser) {
            return res.status(400).send("User already registered! Please log in");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = await userModel.create({
            email,
            password: hashedPassword,
            fullname,
        });

        let token = generateToken(user);
        res.cookie("token", token, { httpOnly: true });
        res.status(201).send("User created successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.loginUser = async function (req, res) {
    try {
        let { email, password } = req.body;
        let user = await userModel.findOne({email: email});
        if(!user) return res.status(400).send("Email or password is incorrect");

        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch) {
            let token = generateToken(user);
            res.cookie("token", token, { httpOnly: true });
            res.redirect("/chat");
        } else {
            res.status(400).send("Email or password is incorrect");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.logoutUser = function (req, res) {
    res.clearCookie("token");
    req.flash("success", "Logged out successfully");
    res.redirect("/");
};