const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { isLoggedIn } = require("../middleware");
const flash = require("express-flash");

router.get("/products", async (req, res) => {
    try {
        const products = await Product.find({});
        res.render("../views/products/index", { products });
    } catch (error) {
        console.error(error);
        req.flash("error", "Error fetching products");
        res.redirect("/products");
    }
});

router.get("/products/new", isLoggedIn, (req, res) => {
    res.render("../views/products/new");
});

router.post("/products", isLoggedIn, async (req, res) => {
    try {
        const { productName, productPrice, productImage, productDescription } = req.body;
        await Product.create({
            name: productName,
            price: productPrice,
            img: productImage,
            desc: productDescription
        });
        req.flash("success", "Product added successfully!!");
        res.redirect("/products");
    } catch (error) {
        console.error(error);
        req.flash("error", "Error adding product");
        res.redirect("/products");
    }
});

router.get("/products/show/:productid", async (req, res) => {
    try {
        const { productid } = req.params;
        const productInfo = await Product.findById(productid).populate("reviews");
        res.render("../views/products/show", { productInfo });
    } catch (error) {
        console.error(error);
        req.flash("error", "Error fetching product information");
        res.redirect("/products");
    }
});

router.get("/products/:productid/edit", isLoggedIn, async (req, res) => {
    try {
        const { productid } = req.params;
        const product = await Product.findById(productid);
        res.render("../views/products/edit", { product });
    } catch (error) {
        console.error(error);
        req.flash("error", "Error fetching product for editing");
        res.redirect("/products");
    }
});

router.patch("/products/:productid", isLoggedIn, async (req, res) => {
    try {
        const { productid } = req.params;
        const { productName, productImage, productPrice, productDescription } = req.body;
        await Product.findByIdAndUpdate(productid, {
            name: productName,
            img: productImage,
            price: productPrice,
            desc: productDescription
        });
        req.flash("success", "Product successfully updated");
        res.redirect("/products/show/" + productid);
    } catch (error) {
        console.error(error);
        req.flash("error", "Error updating product");
        res.redirect("/products");
    }
});

router.delete("/products/:productid", isLoggedIn, async (req, res) => {
    try {
        const { productid } = req.params;
        await Product.findByIdAndDelete(productid);
        req.flash("error", "Product removed successfully");
        res.redirect("/products");
    } catch (error) {
        console.error(error);
        req.flash("error", "Error deleting product");
        res.redirect("/products");
    }
});

module.exports = router;
