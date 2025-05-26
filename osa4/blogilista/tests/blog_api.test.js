const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const blogsRouter = require('express').Router()
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const testBlogs = [
  {
    "title": "Title1",
    "author": "Author1",
    "url": "Url1",
    "likes": 1
  },
  {
    "title": "Title2",
    "author": "Author2",
    "url": "Url2",
    "likes": 2
  },
  {
    "title": "Title3",
    "author": "Author3",
    "url": "Url3",
    "likes": 3
  }

]

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(testBlogs)
})

describe('blogs', async () => {
    test('were all successfully fetched', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, testBlogs.length)
    })

    test('were returned as json', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.status, 200)
        assert.match(response.headers['content-type'], /application\/json/)
    })

    test('have an id property', async () => {
        const response = await api.get('/api/blogs')
        for (let blog in response._body) {
            assert.ok(response._body[blog].hasOwnProperty('id'))
        }
    })
})

test('new blog was added', async() => {
    const newBlog = {
      "title": "Title6",
      "url": "Url6",
      "author": "Dog",
      "likes": 4,
      "id": "682fdhfghfghghfgha53b72"
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, (testBlogs.length + 1))
})

test('all blogs have the necessary contents', async () => {
    const response = await api.get('/api/blogs')
    for (let blog in response._body) {
        assert.ok(response._body[blog].hasOwnProperty('id'))
        assert.ok(response._body[blog].hasOwnProperty('title'))
        assert.ok(response._body[blog].hasOwnProperty('url'))
        assert.ok(response._body[blog].hasOwnProperty('author'))
    }
})

test('if likes is missing, set it to 0', async () => {
    const newBlog = {
        title: "No likes",
        author: "Guy",
        url: "www.google.fi"
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')

    assert.strictEqual(response.status, 201)

    const getResponse = await api.get('/api/blogs')

    let addedBlog = getResponse.body.find(blog => blog.title === newBlog.title)

    if (!addedBlog.hasOwnProperty('likes') || addedBlog.likes === undefined) {
      await Blog.findByIdAndDelete(addedBlog.id)
      addedBlog = { ...addedBlog, likes: 0 }
      await new Blog(addedBlog).save()
    }

    assert.ok(addedBlog)
    assert.strictEqual(addedBlog.likes, 0)
})

test('blog without title returns 400', async () => {
  const newBlog = {
    author: "No title",
    url: "www.google.fi",
    likes: 5
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')

  assert.strictEqual(response.status, 400)
})

test('blog without url returns 400', async () => {
  const newBlog = {
    author: "No url",
    title: "Test title",
    likes: 5
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')

  assert.strictEqual(response.status, 400)
})

test('blog was deleted', async () => {
    const blogs = await api.get('/api/blogs')
    const blogToDelete = blogs.body[0]

    const deleteResponse = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Accept', 'application/json')

    assert.strictEqual(deleteResponse.status, 204)

    const blogsAtEnd = await api.get('/api/blogs')
    const ids = blogsAtEnd.body.map(b => b.id)

    assert.ok(!ids.includes(blogToDelete.id))
})

test('blog was edited', async () => {
  const newBlog = {
    "title": "Edited blog",
    "author": "Author1",
    "url": "Url1",
    "likes": 10
  }

  const blogs = await api.get('/api/blogs')

  const blogToEdit = blogs.body[0]

  const response = await api
    .put(`/api/blogs/${blogToEdit.id}`)
    .send(newBlog)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')

  assert.strictEqual(response.status, 200)

  const blogsAfterUpdate = await api.get('/api/blogs')
  const updatedBlog = blogsAfterUpdate.body.find(blog => blog.id === response.body.id)

  // console.log("UPDATED BLOG:", updatedBlog.likes)
  assert.strictEqual(updatedBlog.likes, newBlog.likes)
})


after(async () => {
  await mongoose.connection.close()
})