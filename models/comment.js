var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
   text: String, 
   author: String
});

var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;