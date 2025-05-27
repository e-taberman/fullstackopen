const express = require('express')
const mongoose = require('mongoose')
const { PORT, MONGO_URL } = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const { usersRounter } = require('./controllers/users')

const app = express()

logger.info('Connecting to', MONGO_URL)

mongoose
    .connect(MONGO_URL)
    .then(() => {
        logger.info('Connected to MongoDB')
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB:', error.message)
    })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRounter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app