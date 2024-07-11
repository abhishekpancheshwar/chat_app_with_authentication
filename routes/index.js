const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const productModel = require('../models/product-model');

router.get("/", function(req, res){
    let error = req.flash("error");
    res.render("index", { error });
});

router.get('/shop', isLoggedIn, async function (req, res){
    let products = await productModel.find();
    console.log(products);
    res.redirect("shop", { products });
});

router.get("/logout", isLoggedIn, async function (req, res){
    try {
        const products = await productModel.find(); // Assuming you're using Mongoose
        res.render('shop', { products: products });
      } catch (error) {
        res.send(error);
      }
})

module.exports = router;
