const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    img: String,
    price: Number,
    desc: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
