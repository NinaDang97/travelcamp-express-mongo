var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// ==========================================
//          COMMENT ROUTES
// ==========================================
router.get("/new", isLoggedIn, function(req, res) {
    // find campground by id
    // console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
             res.render("comments/new", {campground: campground});
        }
    })
   
});

router.post("/", isLoggedIn, function(req, res){
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
                    //add username and id of user to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    
                    console.log(comment);
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                     //redirect campground show page
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
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

module.exports = router;
