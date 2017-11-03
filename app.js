var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");
    
mongoose.connect("mongodb://localhost/travel_camp_v4", {useMongoClient: true});
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
seedDB();

app.get("/", function(req, res){
   res.render("landing"); 
});

//////////////////////////////////////////
/////////////INDEX ROUTE//////////////////
//////////////////////////////////////////
app.get("/campgrounds", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    })
});

//////////////////////////////////////////
/////////////CREATE ROUTE//////////////////
//////////////////////////////////////////
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res){
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
app.get("/campgrounds/:id/comments/new", function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
             res.render("comments/new", {campground: campground});
        }
    })
   
});

app.post("/campgrounds/:id/comments", function(req, res){
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

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started!!!!!");
})