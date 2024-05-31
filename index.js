require('dotenv').config();
const express = require('express');
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const colors = require("colors");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const passport = require("passport");
const User = require("./models/user");
const seedProduct = require("./seed");

// Session Configuration
const sessionConfig = {
    secret: 'keyword',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
};

// Middleware
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.authenticate('session'));

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global Variables
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentuser = req.user;
    next();
});

// MongoDB Connection
const dbURL = process.env.dbURL;

if (!dbURL) {
    console.error('MongoDB URI is not set in environment variables');
    process.exit(1);
}

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB".blue);
    seedProduct();  // Seed products after connection
}).catch((err) => console.error(err));

// Routes
app.get("/", (req, res) => {
    res.render("../views/home");
});
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(cartRoutes);

// Server Listening
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
