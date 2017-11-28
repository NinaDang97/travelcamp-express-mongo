var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//////////////////////////////////////////
/////////////INDEX ROUTE//////////////////
//////////////////////////////////////////
router.get("/", function(req, res){;
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
router.post("/",  middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newCampground = {name: name, image: image, description: desc, author: author};
    
    //create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            console.log(newlyCreated);
            // redirect back to /campgrounds page
            req.flash("success", "Your new campground " + newlyCreated.name + " is created!");
            res.redirect("/campgrounds");
        }
    })
});

//////////////////////////////////////////
/////////////NEW ROUTE////////////////////
//////////////////////////////////////////
router.get("/new",  middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//////////////////////////////////////////
/////////////SHOW ROUTE///////////////////
//////////////////////////////////////////
//Show more info about campground
router.get("/:id", function(req, res) {
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

//////////////////////////////////////////
/////////////EDIT ROUTE///////////////////
//////////////////////////////////////////
//Edit campground form route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        //does user own the campground??
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//Update route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else{
           req.flash("success", "Your update on " + req.body.campground.name + " is successful!");
           res.redirect("/campgrounds/" + req.params.id);
       }
   }) 
});

//////////////////////////////////////////
/////////////DELETE ROUTE/////////////////
//////////////////////////////////////////
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){req.flash("error", "Campground is not found!");
            res.redirect("/campgrounds");
       } else{
            req.flash("success", "The campground is successfully removed!");
            res.redirect("/campgrounds");  
       }
   });
});

module.exports = router;


