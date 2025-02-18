const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const cors = require('cors')
const port = process.env.PORT || 5000

connectDB()

const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/comments', require('./routes/commentRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/movies', require('./routes/movieRoutes'))
app.use('/api/ratings', require('./routes/ratingRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`server started on port ${port}`))