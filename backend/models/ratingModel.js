const mongoose = require('mongoose')

/*
This schema is for ratings. I want ratings to be seperate from comments, as users can update a rating without updating a comment
*/
const ratingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', 
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Movie', 
    },
    rating: {
      type: Number,
      min: 1,
      max: 5, 
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Rating', ratingSchema);
