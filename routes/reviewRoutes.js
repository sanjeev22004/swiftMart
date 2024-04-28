const express=require("express");
const router=express.Router();
const Review=require("../models/review");
const Product=require("../models/product");


router.post("/products/:productid/review",async(req,res)=>{
    const {productid}=req.params;
    const{rating,comment}=req.body;
    console.log(rating);
    console.log(comment);
    const product= await Product.findById(productid);
    const review= await  Review.create({rating,comment});

    product.reviews.push(review);
    await product.save();

    res.redirect(`/products/show/${productid}`)
    


})

module.exports=router;