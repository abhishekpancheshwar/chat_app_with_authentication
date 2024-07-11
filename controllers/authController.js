const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/generateToken');
const product = require('../routes/productsRouter')


module.exports.registerUser = async function (req, res) {
    try {
        let { email, password, fullname } = req.body;
    // add joy feature if any value would not come from form then it will not able to register

    const user = await userModel.findOne({email: email})
    if(user) 
        return res.status(401).send("User already registered! please log in ")

    bcrypt.genSalt(10, function (err, salt){
        bcrypt.hash(password, salt, async function (err, hash){
            if(err) return res.send(err.message);
            else{
                let user = await userModel.create({
                    email,
                    password: hash,
                    fullname,
                });

                let token = generateToken(user);
                res.cookie("token", token);
                
                res.send("user created successfully");
            }
        });
    });

    } catch (err) {
        res.send(err.message);
    }
}

module.exports.loginUser = async function (req, res) {
    let { email, password } = req.body;

    let user = await userModel.findOne({email: email});
    let error = req.flash("error");
    if(!user) return res.send("Email and Password is Incorrect");

    bcrypt.compare(password, user.password, function(err, result) {
        if(result) {
            let token = generateToken(user);
            res.cookie("token", token);
            res.render("shop", { error: [] });
        }
        else {
            return res.send("email or password incorrect");
        }
    });
};

module.exports.logoutUser = async function (req, res) {
    res.clearCookie("token", "");
    res.redirect("/");
};