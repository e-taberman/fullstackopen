const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { userExtractor } = require("../utils/middleware");
const { request } = require("../app");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const user = request.user;

  if (!user.id) {
    return response.status(401).json({ error: "invalid token" });
  }
  if (!request.body.title || !request.body.url) {
    return response.status(400).json({
      error: "Title or url is missing",
    });
  }
  try {
    if (request.body.likes === undefined) {
      request.body.likes = 0;
    }
    const blog = new Blog({ ...request.body, user: user._id });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;
  try {
    if (!user.id) {
      return response.status(401).json({ error: "invalid token" });
    }
    let deletedBlog = await Blog.findById(request.params.id);

    if (user.id !== user._id.toString()) {
      return response.status(400).json({ error: "not authorized" });
    }
    if (!deletedBlog) {
      return response.status(404).json({ error: "blog not found" });
    }
    deletedBlog = await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).end();
    }
    blog.title = request.body.title;
    blog.author = request.body.author;
    blog.url = request.body.url;
    blog.likes = request.body.likes;
    blog.id = request.body.id;

    const updatedBlog = await blog.save();
    response.json(updatedBlog);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

blogsRouter.post("/:id/comments", userExtractor, async (request, response) => {
  const user = request.user;
  console.log("REQUST BODY:", request.body);

  if (!user.id) {
    return response.status(401).json({ error: "invalid token" });
  }

  try {
    const blog = await Blog.findById(request.params.id);
    const comment = request.body.comment;
    const id = request.body.id;
    blog.comments.push(comment);

    const savedBlog = await blog.save();

    return response.status(201).json(savedBlog);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

module.exports = blogsRouter;
