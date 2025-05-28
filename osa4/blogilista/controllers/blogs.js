const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }
  const user = await User.findById(decodedToken.id)
  if (!request.body.title || !request.body.url) {
    return response.status(400).json({
      error: 'Title or url is missing'
    })
  }
  try {
    const blog = new Blog({ ...request.body, user: user._id })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  }
  catch (error) {
    response.status(400).json({ error: error.message })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  try {
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'invalid token' })
    }
    const deletedBlog = await Blog.findById(request.params.id)

    if (decodedToken.id !== deletedBlog.user.toString())
    {
      return response.status(400).json({ error: 'not authorized' })
    }
    if (!deletedBlog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    deletedBlog = await Blog.findByIdAndDelete(request.params.id)
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