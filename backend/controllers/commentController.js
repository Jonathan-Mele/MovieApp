const asyncHandler = require('express-async-handler')

const Comment = require('../models/commentModel')
const User = require('../models/userModel')

// @desc get comments
// @route GET /api/comments
// @access Private
const getComments = asyncHandler(async (req, res) => {
    const { movieId } = req.query; 
  
    if (!movieId) {
      res.status(400);
      return res.json({ message: 'Movie ID is required' }); 
    }
    
    //Query for comments for the movie id in the query parameters. We dont need a function for "getting all comments", as that is not relevant to the app
    const comments = await Comment.find({ movie: movieId })
      .populate('user', 'name _id') 
      .sort({ createdAt: -1 }); 
    return res.status(200).json(comments); // Return comments as JSON
});
  

// @desc set comments
// @route POST /api/comments
// @access Private
const setComment = asyncHandler(async (req, res) => {
    if (!req.body.text) {
      return res.status(400).json({ message: "Please add a text field" });
    }
  
    if (!req.body.movieId) {
      return res.status(400).json({ message: "Movie ID is required" });
    }
    
    //query to add a comment to the database with the parameters in the body. We always have access to the user because of the auth middleware and jwt
    try {
      const comment = await Comment.create({
        text: req.body.text,
        user: req.user.id,
        movie: req.body.movieId,
      });
  
      return res.status(200).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      throw new Error("Failed to create comment");
    }
});
  
  

// @desc get comments
// @route PUT /api/comments/:id
// @access Private
const updateComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id)

    if(!comment){
        res.status(400)
        throw new Error('Comment not found')
    }

    const user = await User.findById(req.user.id)

    if(!user){
        res.status(401)
        throw new Error('User not found')
    }

    if(goal.user.toString() !== user.id){
        res.status(401)
        throw new Error('User not authorized')
    }
    
    //This query both searches and updates a comment
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json(updatedComment)
})

// @desc delete comments
// @route DELETE /api/comments/:id
// @access Private
const deleteComment = asyncHandler(async (req, res) => {
  //query to grab the comment
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
      res.status(400);
      throw new Error('Comment not found');
  }

  //grab the user
  const user = await User.findById(req.user.id)

  //check for user
  if(!user){
      res.status(401)
      throw new Error('User not found')
  }

  //make sure login user matched the comment user - do not want any way for someone to delete a comment that is not their own
  if(comment.user.toString() !== user.id){
      res.status(401)
      throw new Error('User not authorized')
  }

  //simple query to delete the comment
  await comment.deleteOne();

  res.status(200).json({ id: req.params.id })
})

module.exports = {
    getComments,
    setComment,
    updateComment,
    deleteComment,
}