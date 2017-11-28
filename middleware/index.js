var Campground = require("../models/campground");
var Comment = require("../models/comment");
//all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    //is user logged in
    //otherwise, redirect
    //if not, redirect 
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground is not found.");
            res.redirect("back");
        } else{
            //does user own the campground??
            if(foundCampground.author.id.equals(req.user._id)){
                 next(); //move on to the code of edit/update/delete 
            } else{
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        }
        });
    } else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back"); //take user to previous where they were  
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    //is user logged in
    //otherwise, redirect
    //if not, redirect 
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("/campgrounds");
        } else{
            //does user own the campground??
            if(foundComment.author.id.equals(req.user._id)){
                 next(); //move on to the code of edit/update/delete 
            } else{
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        }
        });
    } else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back"); //take user to previous where they were  
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    //add middleware: isLoggedIn()
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that"); //key: error, value: Please ...
    res.redirect("/login");
}

module.exports = middlewareObj;