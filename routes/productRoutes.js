const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { isLoggedIn } = require("../middleware");
const flash = require("express-flash");
const multer = require("multer");



// Set a larger limit for urlencoded and json bodies

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});


// GET route to display all products
router.get("/products", async (req, res) => {
    try {
        const products = await Product.find({});
        
        // Convert each product's image buffer to Base64
        const productsWithImages = products.map(product => {
            const imgBase64 = product.img.toString('base64'); // Convert buffer to Base64
            const imgSrc = `data:image/jpeg;base64,${imgBase64}`; // Create Base64 image string
            return { ...product._doc, img: imgSrc }; // Include Base64 image in the product object
        });

        res.render("../views/products/index", { products: productsWithImages });
    } catch (error) {
        console.error(error);
        req.flash("error", "Error fetching products");
        res.redirect("/products");
    }
});

// GET route to show the new product form
router.get("/products/new", isLoggedIn, (req, res) => {
    res.render("../views/products/new");
});

// POST route to handle image upload and store in MongoDB
router.post("/products", isLoggedIn, upload.single("productImage"), async (req, res) => {
    try {
        const { productName, productPrice, productDescription } = req.body;
        const img = req.file.buffer; // Get image buffer from request

        await Product.create({
            name: productName,
            price: productPrice,
            img: img, // Store image as binary data
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

// GET route to show product details
router.get("/products/show/:productid", async (req, res) => {
    try {
        const { productid } = req.params;
        const productInfo = await Product.findById(productid).populate("reviews");

        // Convert the image buffer to Base64
        const imgBase64 = productInfo.img.toString('base64');
        const imgSrc = `data:image/jpeg;base64,${imgBase64}`;

        res.render("../views/products/show", { productInfo: { ...productInfo._doc, img: imgSrc } });
    } catch (error) {
        console.error(error);
        req.flash("error", "Error fetching product information");
        res.redirect("/products");
    }
});

// GET route to show edit form for a product
router.get("/products/:productid/edit", isLoggedIn, async (req, res) => {
    try {
        const { productid } = req.params;
        const product = await Product.findById(productid);
        
        // Convert image buffer to Base64 for editing
        const imgBase64 = product.img.toString('base64');
        const imgSrc = `data:image/jpeg;base64,${imgBase64}`;

        res.render("../views/products/edit", { product: { ...product._doc, img: imgSrc } });
    } catch (error) {
        console.error(error);
        req.flash("error", "Error fetching product for editing");
        res.redirect("/products");
    }
});

// PATCH route to handle image upload and update in MongoDB
router.patch("/products/:productid", isLoggedIn, upload.single("productImage"), async (req, res) => {
    try {
        const { productid } = req.params;
        const { productName, productPrice, productDescription } = req.body;
        const img = req.file ? req.file.buffer : undefined; // Get image buffer if uploaded

        await Product.findByIdAndUpdate(productid, {
            name: productName,
            img: img, // Update img with new buffer if a new image is uploaded
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

// DELETE route to remove a product
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

// POST route to handle adding product to cart
router.post("/products/:productid/cart", isLoggedIn, async (req, res) => {
    const { productid } = req.params; // Get the product ID from the URL
    // Logic to add the product to the cart using productid
    // e.g., req.session.cart.push(productid); // Assuming you're using session to store the cart
    req.flash("success", "Product added to cart successfully!");
    res.redirect("/products/show/" + productid); // Redirect to product details
});

module.exports = router;
