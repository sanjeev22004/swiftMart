const express=require("express");
const router=express.Router();
const User=require("../models/user");
const passport=require("passport")



router.get("/register",(req,res)=>{
    console.log("signup");
    res.render("../views/authentication/signup");

})
//havent handle user alredy exist
router.post("/register",async(req,res)=>{
    const {username,email,password}=req.body;
    const user=new User({username,email});
    const newUser = await User.register(user,password);
    req.flash("sucess","user registered sucessfully");
    res.redirect("/login")
})

router.get("/login",(req,res)=>{
    res.render("../views/authentication/login")
    
})
//if we are login only with two parameter(failure) 




router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: 'Invalid email or password', // Custom failure flash message
    })(req, res, next);
}, (req, res) => {
    req.flash('success', 'Welcome back'+req.user.username);
    res.redirect('/products');
});


router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err) return next(err);

        req.flash("success","sucussfully loggout");
        res.redirect("/login");
    })
})
module.exports=router;