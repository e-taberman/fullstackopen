const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).json({
      error: 'Title or url is missing'
    })
  }

  const blog = new Blog(request.body)
  blog.save()
    .then((result) => {
      response.status(201).json(result)
    })
    .catch((error) => {
      console.error('Error saving blog:', error)
      response.status(400).json({ error: error.message })
    })
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
    if (!deletedBlog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    response.status(204).end()
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).end()
    }
    blog.title = request.body.title
    blog.author = request.body.author
    blog.url = request.body.url
    blog.likes = request.body.likes
    blog.id = request.body.id

    const updatedBlog = await blog.save()
    response.json(updatedBlog)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

module.exports = blogsRouter