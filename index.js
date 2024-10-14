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

// MongoDB Connection
const dbURL = process.env.dbURL || 'mongodb://localhost:27017/yourDatabase';

mongoose.connect(dbURL)
  .then(() => console.log('MongoDB connected successfully'.green))
  .catch(err => console.error('MongoDB connection error:'.red, err));

// Session configuration
const MongoStore = require('connect-mongo');

app.use(session({
  secret: 'keyword',
  resave: false,
  saveUninitialized: false, 
  store: MongoStore.create({ mongoUrl: dbURL }),  // Use dbURL here
  cookie: {
    secure: false,  // Set to true in production with HTTPS
    maxAge: 1000 * 60 * 60 * 24,  // 1 day expiry
  }
}));

// Middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
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

// Routes
app.get("/", (req, res) => {
    res.render("../views/home");
});
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoute = require('./routes/paymentRoute');

app.use(paymentRoute);
app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(cartRoutes);

// Server Listening
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
