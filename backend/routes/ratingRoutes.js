const express = require('express')
const router = express.Router()
const { 
    setRating,
    getRatings,
    getAverageRating
} = require('../controllers/ratingController')
const{ protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getRatings).post(protect, setRating);
router.get('/average/:movieId', getAverageRating);


module.exports = router;