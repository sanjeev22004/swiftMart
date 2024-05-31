const mongoose = require('mongoose');
const Product = require('./models/product');

const productInfo = [
    {
        name: "Product A",
        img: "https://example.com/product-a.jpg",
        price: 19.99,
        desc: "This is Product A. It is a high-quality product that meets all your needs."
    },
    {
        name: "Product B",
        img: "https://example.com/product-b.jpg",
        price: 29.99,
        desc: "Product B is perfect for those looking for reliability and style."
    }
];

async function seedProduct() {
    await Product.deleteMany({});
    await Product.insertMany(productInfo);
    console.log("Products have been seeded");
}

module.exports = seedProduct;
