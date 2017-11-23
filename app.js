var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverried  = require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");

//require ROUTES ROOT
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

//mongo connect + app config
mongoose.connect("mongodb://localhost/travel_camp_v9", {useMongoClient: true});
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverried("_method"));
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Khanh is most beautiful girl ever!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//This is middleware
//pass req.user to every single template EJS
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next(); //without next(), it stops and doesn't move to next middleware/route handler
});

//require routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started!!!!!");
})