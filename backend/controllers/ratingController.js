const asyncHandler = require('express-async-handler');
const Rating = require('../models/ratingModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// @desc Get ratings for a movie
// @route GET /api/ratings
// @access Private
const getRatings = asyncHandler(async (req, res) => {
  //We will want to display the average rating, so we grab all the ratings for a specific movie
  const { movieId } = req.query; 

  if (!movieId) {
    res.status(400);
    throw new Error('Movie ID is required');
  }

  const ratings = await Rating.find({ movie: movieId })
    .populate('user', 'name') 
    .sort({ createdAt: -1 }); 

  return res.status(200).json(ratings); 
});

// @desc Set a rating for a movie
// @route POST /api/ratings
// @access Private
const setRating = asyncHandler(async (req, res) => {
  //going to get a number rating from the user and set the rating for that movie from that user
  const { movieId, rating } = req.body; 

  if (!movieId) {
    res.status(400);
    throw new Error('Movie ID is required');
  }

  if (!rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be a number between 1 and 5');
  }

  const existingRating = await Rating.findOne({ user: req.user.id, movie: movieId });

  //I add the update logic here. If we detect that the user already has a rating, we can just assume they want to update it when the submit another on so we update it
  //we are going to average the ratings, so we definitley do not want to have the user add another rating of their own
  if (existingRating) {
    existingRating.rating = rating;
    const updatedRating = await existingRating.save();
    return res.status(200).json(updatedRating);
  }
  // Create a new rating
  const newRating = await Rating.create({
    user: req.user.id,
    movie: movieId,
    rating,
  });

  return res.status(201).json(newRating); // Return the newly created rating
});

// @desc Get average rating for a movie
// @route GET /api/ratings/average/:movieId
// @access Public
const getAverageRating = asyncHandler(async (req, res) => {
    const { movieId } = req.params;
  
    if (!movieId) {
      res.status(400);
      throw new Error('Movie ID is required');
    }
  
    try {
      //aggregate query to average the ratings for a specific movie
      const result = await Rating.aggregate([
        { $match: { movie: new mongoose.Types.ObjectId(movieId) } },
        {
          $group: {
            _id: '$movie',
            averageRating: { $avg: '$rating' },
            ratingsCount: { $sum: 1 },
          },
        },
      ]);
  
      if (result.length === 0) {
        // No ratings found for the movie
        return res.status(200).json({ averageRating: 0, ratingsCount: 0 });
      }
  
      const { averageRating, ratingsCount } = result[0];
      res.status(200).json({ averageRating: averageRating.toFixed(1), ratingsCount });
    } catch (error) {
      console.error('Error calculating average rating:', error);
      res.status(500).json({ message: 'Failed to calculate average rating' });
    }
});
  
module.exports = {
  getRatings,
  setRating,
  getAverageRating,
};
