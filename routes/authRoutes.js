const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/register", (req, res) => {
    res.render("../views/authentication/signup");
});

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    try {
        const newUser = await User.register(user, password);
        req.flash("success", "User registered successfully");
        res.redirect("/login");
    } catch (error) {
        console.error(error);
        req.flash("error", "Error registering user");
        res.redirect("/register");
    }
});

router.get("/login", (req, res) => {
    res.render("../views/authentication/login");
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Invalid email or password',
}), (req, res) => {
    req.flash('success', 'Welcome back ' + req.user.username);
    res.redirect('/products');
});

router.get("/logout", (req, res) => {
    req.logOut((err) => {
        if (err) {
            console.error(err);
            req.flash("error", "Error logging out");
            res.redirect("/login");
        } else {
            req.flash("success", "Successfully logged out");
            res.redirect("/login");
        }
    });
});

module.exports = router;
