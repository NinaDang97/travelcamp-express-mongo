var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

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
router.post("/", isLoggedIn, function(req, res){
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
            res.redirect("/campgrounds");
        }
    })
});

//////////////////////////////////////////
/////////////NEW ROUTE////////////////////
//////////////////////////////////////////
router.get("/new", isLoggedIn, function(req, res){
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
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        //does user own the campground??
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//Update route
router.put("/:id", checkCampgroundOwnership, function(req, res){
    //find and update correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else{
           res.redirect("/campgrounds/" + req.params.id);
       }
   }) 
});

//////////////////////////////////////////
/////////////DELETE ROUTE/////////////////
//////////////////////////////////////////
router.delete("/:id", checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
            res.redirect("/campgrounds");
       } else{
            res.redirect("/campgrounds");  
       }
   });
});

//add middleware: isLoggedIn()
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//another middleware
function checkCampgroundOwnership(req, res, next){
    //is user logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            //does user own the campground??
            if(foundCampground.author.id.equals(req.user._id)){
                 next(); //move on to the code of edit/update/delete 
            } else{
                res.redirect("back");
            }
        }
        });
    } else{
        res.redirect("back"); //take user to previous where they were  
    }
   
    //otherwise, redirect
    //if not, redirect 
}

module.exports = router;


