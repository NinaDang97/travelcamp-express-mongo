var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
   res.render("landing"); 
});

// ==========================================
//              AUTH ROUTES
// ==========================================

//Show register form
router.get("/register", function(req, res) {
    res.render("register");
});

//Handle sign up logic
router.post("/register", function(req, res) {
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
router.get("/login", function(req, res) {
    res.render("login");
});

//Handle login logic
//app.post("/login", middleware, callback)
//middleware is called authenticate() method, setup in passport config: passport.use(new LocalStrategy(User.authenticate())); 
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) { //can get rid of callback 
});

//Logout route
router.get("/logout", function(req, res) {
    req.logout(); 
    res.redirect("/campgrounds");
});

module.exports = router;