const usersRouter = require('express').Router()
const { default: mongoose } = require('mongoose')
const User = require('../models/user')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })

    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { name, username, password } = request.body

    if (!password || password.length < 3) {
        return response.status(400).json({ error: 'password must be at least 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        name,
        username,
        passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = { usersRouter }