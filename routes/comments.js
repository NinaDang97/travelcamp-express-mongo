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

//COMMENT EDIT ROUTE
//comment edit form
//campgrounds/:id/comments/:comment_id/edit
router.get("/:comment_id/edit", function(req, res){
    //don't need Campground.findById() to find campground_id
    // already HAVE campground_id in req.params.id
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        } else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//comment update
router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
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
