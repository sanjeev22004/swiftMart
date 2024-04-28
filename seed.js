const mongoose=require("mongoose");
const Product=require("./models/product")

mongoose.connect("mongodb://127.0.0.1:27017/ecom")
.then(()=>console.log("dbconnected sucessfully ecom in seed.js".blue))
.catch((err)=>console.log(err))



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
    },
    {
        name: "Product C",
        img: "https://example.com/product-c.jpg",
        price: 39.99,
        desc: "With Product C, you'll experience unmatched performance and versatility."
    },
    {
        name: "Product D",
        img: "https://example.com/product-d.jpg",
        price: 49.99,
        desc: "Product D offers cutting-edge technology and sleek design."
    },
    {
        name: "Product E",
        img: "https://example.com/product-e.jpg",
        price: 59.99,
        desc: "Elevate your experience with Product E, designed for maximum comfort and efficiency."
    }
];


async function seedProduct(){
await Product.insertMany(productInfo);
console.log("products have been seeded");
}



seedProduct();