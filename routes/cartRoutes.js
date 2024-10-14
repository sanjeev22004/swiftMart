const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const { isLoggedIn } = require("../middleware");

// GET route to display the user's cart
router.get("/product/user/cart", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("cart.id");
        const totalAmount = calculateTotalAmount(user.cart);
        res.render("../views/cart/cartpage", { cart: user.cart, totalAmount, userId: req.user._id });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// POST route to add a product to the user's cart
router.post("/products/show/:productid/cart", isLoggedIn, async (req, res) => {
    console.log("inside");
    try {
        const { productid } = req.params;
        console.log(productid);
        const user = await User.findById(req.user._id);
        const product = await Product.findById(productid);

        console.log("User ID:", req.user._id);
        console.log("Product ID:", productid);
        console.log("User:", user);
        console.log("Product:", product);

        // Check if the product exists
        if (!product) {
            return res.status(404).send({ success: false, error: "Product not found" });
        }

        const existingCartItem = user.cart.find(item => item.id.equals(productid));

        if (existingCartItem) {
            existingCartItem.count++;
            console.log("Incremented count for existing item:", existingCartItem);
        } else {
            user.cart.push({
                id: product._id,
                name: product.name,
                price: product.price,
                img: product.img.toString('base64'), // Ensure this conversion is correct
                count: 1
            });
            console.log("Added new item to cart:", user.cart[user.cart.length - 1]);
        }

        await user.save();
        console.log("Cart updated successfully:", user.cart);
        res.redirect("/product/user/cart");
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).send("Internal Server Error");
    }
});


// POST route to remove a product from the cart
router.post("/product/user/cart/remove", isLoggedIn, async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const result = await User.findByIdAndUpdate(
            userId,
            { $pull: { cart: { id: productId } } },
            { new: true }
        );

        if (!result) {
            return res.status(404).send({ success: false, error: "User not found" });
        }

        res.send({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: "Internal Server Error" });
    }
});

// POST route to increment product count in the cart
router.post("/product/user/cart/increment", isLoggedIn, async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ success: false, error: "User not found" });
        }

        const product = user.cart.find(item => item.id.toString() === productId);
        if (product) {
            product.count += 1;
            await user.save();
            res.send({ success: true });
        } else {
            res.status(404).send({ success: false, error: "Product not found in cart" });
        }
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).send({ success: false, error: "Internal Server Error" });
    }
});

// POST route to decrement product count in the cart
router.post("/product/user/cart/decrement", isLoggedIn, async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ success: false, error: "User not found" });
        }

        const product = user.cart.find(item => item.id.toString() === productId);
        if (product) {
            if (product.count > 1) {
                product.count -= 1;
            } else {
                user.cart = user.cart.filter(item => item.id.toString() !== productId);
            }
            await user.save();
            res.send({ success: true });
        } else {
            res.status(404).send({ success: false, error: "Product not found in cart" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: "Internal Server Error" });
    }
});

// Function to calculate total amount of the cart
function calculateTotalAmount(cart) {
    return cart.reduce((total, item) => total + item.price * item.count, 0);
}

module.exports = router;
