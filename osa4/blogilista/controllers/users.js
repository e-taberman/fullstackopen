const usersRounter = require('express').Router()
const { default: mongoose } = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRounter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRounter.post('/', async (request, response) => {
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

module.exports = { usersRounter }