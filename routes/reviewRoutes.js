const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const Product = require("../models/product");
const { isLoggedIn } = require("../middleware");

router.post("/products/:productid/review", isLoggedIn, async (req, res) => {
    try {
        const { productid } = req.params;
        const { rating, comment } = req.body;
        const product = await Product.findById(productid);
        const review = await Review.create({ rating, comment });
        product.reviews.push(review);
        await product.save();
        res.redirect(`/products/show/${productid}`);
    } catch (error) {
        console.error(error);
        req.flash("error", "Error adding review");
        res.redirect("/products");
    }
});

module.exports = router;
