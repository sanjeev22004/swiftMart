const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const { isLoggedIn } = require("../middleware");

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

router.post("/products/:productid/cart", isLoggedIn, async (req, res) => {
    try {
        const { productid } = req.params;
        const user = await User.findById(req.user._id);

        const existingCartItem = user.cart.find(item => item.id.equals(productid));

        if (existingCartItem) {
            existingCartItem.count++;
        } else {
            const product = await Product.findById(productid);
            user.cart.push({
                id: product._id,
                name: product.name,
                price: product.price,
                img: product.img,
                count: 1
            });
        }

        await user.save();
        res.redirect("/product/user/cart");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/product/user/cart/remove", isLoggedIn, async (req, res) => {
    try {
        const { userId, productId } = req.body;

        await User.findByIdAndUpdate(
            userId,
            { $pull: { cart: { id: productId } } },
            { new: true }
        );

        res.send({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: "Internal Server Error" });
    }
});

function calculateTotalAmount(cart) {
    return cart.reduce((total, item) => total + item.price * item.count, 0);
}

module.exports = router;
