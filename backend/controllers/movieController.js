const asyncHandler = require('express-async-handler')

const Movie = require('../models/movieModel')
const User = require('../models/userModel')

// @desc get movies to display at home page
// @route GET /api/movies
// @access Private
const getMovies = asyncHandler(async (req, res) => {
  //we are gonna query for the home page. Simply grab 50 movies and make sure they have posters (we want the page to look nice)
  //we also order from mopst recent (we want "trending" movies or ones that are probably more relevant)
  try {
    const limit = parseInt(req.query.limit) || 50;

    const movies = await Movie.find({
      poster: { $exists: true, $ne: null }, // Ensure movies have posters
      year: { $gte: 2000 }, // Only fetch movies released after 2000
    })
      .sort({ year: -1 }) // Sort by most recent movies first
      .limit(limit); // Return more movies (default to 50)

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movies' });
  }
})

const getMovieByTitle = asyncHandler(async (req, res) => {
  //for the search bar - query for movies with the user tect in the title. I want this to be a soft search, so entering phrases can get you the movie you want
  const { title } = req.params;

  if (!title) {
    res.status(400); 
    throw new Error('Movie title is required');
  }

  try {
    const movies = await Movie.find({ title: { $regex: title, $options: 'i' } }).sort({year: -1}); // Case-insensitive match
    if (!movies || movies.length === 0) {
      res.status(404); 
      throw new Error('No movies found with the specified title');
    }
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movie' });
  }
});

const getMovieById = asyncHandler(async (req, res) => {
  //just get a movies by its id
  const { id } = req.params;

  try {
    const movie = await Movie.findById(id);

    if (!movie) {
      res.status(404);
      throw new Error('Movie not found');
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movie details' });
  }
});

// @desc Get movies by actor
// @route GET /api/movies/searchActor
// @access Private
const getMoviesByActor = asyncHandler(async (req, res) => {
  const { actor } = req.query; // Retrieve the actor's name from the query parameters

  if (!actor) {
    res.status(400);
    throw new Error('Actor name is required');
  }

  // Find movies where the actor's name is in the cast array
  const movies = await Movie.find({ cast: { $regex: actor, $options: 'i' } }); // Case-insensitive match

  if (!movies || movies.length === 0) {
    res.status(404);
    throw new Error('No movies found for the given actor');
  }

  res.status(200).json(movies);
});

module.exports = { 
  getMovies, 
  getMovieByTitle, 
  getMovieById, 
  getMoviesByActor 
}