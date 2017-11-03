var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");

//Define an array containing 3 objects
var data = [
    {
        name: "Paris", 
        image: "https://farm2.staticflickr.com/1454/24175721610_d4708bdbf2.jpg",
        description: "Such a wonderful city should visit"
    },
    {
        name: "Osaka", 
        image: "https://farm2.staticflickr.com/1564/26311110686_2ca1af2f0d.jpg",
        description: "Integration between modern and traditional cultures!"
    },
    {
        name: "Helsinki", 
        image: "https://farm8.staticflickr.com/7176/26797203161_aa5afd25da.jpg",
        description: "Beautiful nature! But harsh weather :("
    }
]

function seedDB(){
    //Remove all campgrounds
    // Campground.remove({}, function(err){
    //     if(err){
    //         console.log(err);
    //     }
    //     console.log("Removed everything!");
        
    //     //Add a few campgrounds
    //     data.forEach(function(seed){
    //         Campground.create(seed, function(err, campground){
    //             if(err){
    //                 console.log(err);
    //             } else{
    //                 console.log("Added a campground");
    //                 //After create each campground
    //                 //create and add comment
    //                 Comment.create(
    //                     {
    //                         text: "This place is wonderful like you said",
    //                         author: "Williams David"
    //                     }, function(err, comment){
    //                         if(err){
    //                             console.log(err);
    //                         } else{
    //                             //when successful created comment
    //                             //Associate with the campground
    //                             campground.comments.push(comment);
    //                             campground.save();
    //                             console.log("New comment added");
    //                         }
                            
    //                     }
    //                 )
    //             }
    //         })
    //     })
    // });
    
    //add a few comments
    
}    

module.exports = seedDB;