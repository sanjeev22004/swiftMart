const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const router = express.Router();

require('dotenv').config(); 

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY, // Replace with your Razorpay Key ID
    key_secret: process.env.RAZORPAY_SECRET_key // Replace with your Razorpay Key Secret
});

// Route to create an order
router.post("/createOrder", async (req, res) => {
    const { amount, currency = "INR" } = req.body;
     console.log("create");
     const amountInPaise = Math.round(amount ); 
    const options = {
        amount: amountInPaise,
        currency,
        receipt: `order_${Date.now()}`
    };

    try {
        const order = await razorpay.orders.create(options);
        console.log("send res");
        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to create Razorpay order" });
    }
});

// Route to verify payment signature after checkout
router.post("/verifyPayment", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
        // Signature verified, payment successful
        res.json({ success: true, message: "Payment successful" });
    } else {
        res.status(400).json({ success: false, error: "Payment verification failed" });
    }
});

module.exports = router;
