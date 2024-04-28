const express=require("express");
const router=express.Router();
const Product=require("../models/product");
const flash = require("express-flash");



//get all the products
router.get("/products",async(req,res)=>{
    const products=await Product.find({});
    console.log("produvt sent to ejs file sucessfully")
    console.log(products);
    
    res.render("../views/products/index",{products});
})

// get form to create new product
router.get("/products/new",(req,res)=>{
    res.render("../views/products/new");
    console.log("render new file")
})

router.post("/products",async(req,res)=>{
    const { productName, productPrice, productImage, productDescription } = req.body;



        // Create a new product document and save it to the database
        await Product.create({
            name: productName,
            price: productPrice,
            img: productImage,
            desc: productDescription
        });


    req.flash("success","product added sucessfully!!");
    res.redirect("/products")
})
router.get("/products/show/:productid",async(req,res)=>{
   const {productid} =req.params;
   
   
  const productInfo =  await Product.findById(productid).populate("reviews");

    await res.render("../views/products/show",{productInfo});
})


//edit form

router.get("/products/:productid/edit",async(req,res)=>{
    const {productid}=req.params;
    const product =  await Product.findById(productid);
    console.log("this is edit folder");
    console.log(product);
    res.render("../views/products/edit",{product})
   
})
router.patch("/products/:productid",async(req,res)=>{

    const {productid}=req.params;
    const { productName, productImage, productPrice, productDescription } = req.body;

    console.log("inside patch");

    await Product.findByIdAndUpdate(productid, {
        name: productName,
        img: productImage,
        price: productPrice,
        desc: productDescription
    });  
   console.log("databas updated")
   req.flash("success","sucessfully updated");
   res.redirect("/products/show/"+productid);
   
})

//delete

router.delete("/products/:productid", async(req,res)=>{
    const { productid } =req.params;
    await Product.findByIdAndDelete(productid);
    req.flash("error","remove sucessfully");
   
    res.redirect("/products");
})
module.exports=router;