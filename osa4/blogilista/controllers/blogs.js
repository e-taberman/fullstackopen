const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  console.log(response.data)
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)
  console.log("POST: ", request.body)

  blog.save()
    .then((result) => {
      response.status(201).json(result)
    })
    .catch((error) => {
      console.error('Error saving blog:', error)
      response.status(400).json({ error: error.message })
    })
})

module.exports = blogsRouter