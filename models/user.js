const mongoose=require("mongoose");
const passportLocalMongoose =require('passport-local-mongoose');
const userSchema=new mongoose.Schema({
    
    username:String,   //this is automatically handled by passport local mongoose
   
    email:String,
    password:String,

})

userSchema.plugin(passportLocalMongoose);

const User=mongoose.model("User",userSchema);

module.exports=User