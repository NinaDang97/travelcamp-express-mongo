var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");
    
mongoose.connect("mongodb://localhost/travel_camp_v4", {useMongoClient: true});
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
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

app.get("/", function(req, res){
   res.render("landing"); 
});

//////////////////////////////////////////
/////////////INDEX ROUTE//////////////////
//////////////////////////////////////////
app.get("/campgrounds", function(req, res){;
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    })
});

//////////////////////////////////////////
/////////////CREATE ROUTE//////////////////
//////////////////////////////////////////
app.post("/campgrounds", isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    
    var newCampground = {name: name, image: image, description: desc};
    //create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            // redirect back to /campgrounds page
            res.redirect("/campgrounds");
        }
    })
});

//////////////////////////////////////////
/////////////NEW ROUTE////////////////////
//////////////////////////////////////////
app.get("/campgrounds/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//////////////////////////////////////////
/////////////SHOW ROUTE///////////////////
//////////////////////////////////////////
//Show more info about campground
app.get("/campgrounds/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
            if(err){
                console.log(err);
            } else{
                //render show template with that campground
                res.render("campgrounds/show", {campground: foundCampground});
            }
        })
});

// ==========================================
//          COMMENT ROUTES
// ==========================================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
             res.render("comments/new", {campground: campground});
        }
    })
   
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                    console.log(req.body.comment);
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                     //redirect campground show page
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
})

// ==========================================
//              AUTH ROUTES
// ==========================================

//Show register form
app.get("/register", function(req, res) {
    res.render("register");
});

//Handle sign up logic
app.post("/register", function(req, res) {
    //provided by passport-local-mongoose 
    //Step 1: make new user
    //Step 2: if that works, will log user in
    var newUser = new User({username: req.body.username}); // step 1 here
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){ //step 2 happens here
            res.redirect("/campgrounds");
        })
    });
});

//Show login form 
app.get("/login", function(req, res) {
    res.render("login");
});

//Handle login logic
//app.post("/login", middleware, callback)
//middleware is called authenticate() method, setup in passport config: passport.use(new LocalStrategy(User.authenticate())); 
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) { //can get rid of callback 
});

//Logout route
app.get("/logout", function(req, res) {
    req.logout(); 
    res.redirect("/campgrounds");
});

//add middleware: isLoggedIn()
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started!!!!!");
})