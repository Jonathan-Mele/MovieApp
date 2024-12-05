const mongoose = require('mongoose')

/*
Schema for movies
movies have a list of comments. This is needed to display the comments for a given movie

They also have a rating that is seperate from the comments
*/

const movieSchema = mongoose.Schema({
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment' 
    }],
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
    }],
    title: {
        type: String,
        required: [true, 'Please add a name']
    },
    genres: { 
        type: [String], 
        required: false 
    },
    cast: { 
        type: [String], 
        required: false 
    },
},
{
    timestamps: true
})

module.exports = mongoose.model('Movie', movieSchema)