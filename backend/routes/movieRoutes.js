const express = require('express')
const router = express.Router()
const { 
    getMovies,
    getMovieByTitle,
    getMovieById,
    getMoviesByActor
} = require('../controllers/movieController')
const{ protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getMovies)
router.route('/searchActor').get(protect, getMoviesByActor)
router.route('/getMovieByTitle/:title').get(protect, getMovieByTitle)
router.get('/:id', protect, getMovieById);

module.exports = router