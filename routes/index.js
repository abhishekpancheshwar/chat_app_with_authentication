const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const productModel = require('../models/product-model');

router.get("/", function(req, res){
    let error = req.flash("error");
    res.render("index", { error });
});

router.get('/shop', isLoggedIn, async function (req, res){
    try {
        let products = await productModel.find();
        res.render("shop", { products });
    } catch (error) {
        res.status(500).send("Error fetching products");
    }
});

router.get("/logout", isLoggedIn, function (req, res){
    res.clearCookie("token");
    req.flash("success", "Logged out successfully");
    res.redirect("/");
});

module.exports = router;