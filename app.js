const express = require("express");
const app = express();
const bodyParser = require("body-parser");//need to handle POST method: req.body
const mongoose = require("mongoose");//take care of MongoDB
const flash = require("connect-flash");
const Campground = require("./models/campground");
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');
const passport = require('passport');//for authentication
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
// const passportLocalMongoose = require("passport-local-mongoose");

// if yelp_camp db doesn't exist, will create one
// mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
const dbUrl = "mongodb+srv://wangtian:970817@cluster0-xltq9.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(dbUrl, { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//requring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// a middleware run for every single route
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;// to monitor login status
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);//need merge common params into commentRoutes

app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log("The YelpCamp Server Has Started!");
});

