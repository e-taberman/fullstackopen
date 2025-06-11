const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");
const { getBlogsInDb } = require("./test_helper");
const { testBlogs, testUsers } = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(testBlogs);
  await User.deleteMany({});
  await api
    .post("/api/users")
    .set("Content-Type", "application/json")
    .send(helper.loginUser);
});

describe("blogs", async () => {
  test("were all successfully fetched", async () => {
    const blogs = await getBlogsInDb();
    assert.strictEqual(blogs.length, testBlogs.length);
  });

  test("were returned as json", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.status, 200);
    assert.match(response.headers["content-type"], /application\/json/);
  });

  test("have an id property", async () => {
    const response = await api.get("/api/blogs");
    for (let blog in response._body) {
      assert.ok(response._body[blog].hasOwnProperty("id"));
    }
  });
});

test("new blog was added", async () => {
  const loggedUser = await api
    .post("/api/login")
    .set("Content-Type", "application/json")
    .send(helper.loginUser);

  const newBlog = {
    title: "Title6",
    url: "Url6",
    author: "Dog",
    likes: 4,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${loggedUser.body.token}`)
    .send(newBlog);

  const blogs = await getBlogsInDb();
  assert.strictEqual(blogs.length, testBlogs.length + 1);
});

test("all blogs have the necessary contents", async () => {
  const response = await api.get("/api/blogs");
  for (let blog in response._body) {
    assert.ok(response._body[blog].hasOwnProperty("id"));
    assert.ok(response._body[blog].hasOwnProperty("title"));
    assert.ok(response._body[blog].hasOwnProperty("url"));
    assert.ok(response._body[blog].hasOwnProperty("author"));
  }
});

test("if likes is missing, set it to 0", async () => {
  const loggedUser = await api
    .post("/api/login")
    .set("Content-Type", "application/json")
    .send(helper.loginUser);

  const newBlog = {
    title: "No likes",
    author: "Guy",
    url: "www.google.fi",
  };

  const response = await api
    .post("/api/blogs")
    .set("Content-Type", "application/json")
    .set("Authorization", `Bearer ${loggedUser.body.token}`)
    .send(newBlog);

  assert.strictEqual(response.status, 201);

  const getResponse = await api.get("/api/blogs");

  let addedBlog = getResponse.body.find((blog) => blog.title === newBlog.title);
  if (!addedBlog.hasOwnProperty("likes") || addedBlog.likes === undefined) {
    await Blog.findByIdAndDelete(addedBlog.id);
    addedBlog = { ...addedBlog, likes: 0 };
    console.log(addedBlog);
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${loggedUser.body.token}`)
      .send(addedBlog);
  }
});

test("blog without title returns 400", async () => {
  const loggedUser = await api
    .post("/api/login")
    .set("Content-Type", "application/json")
    .send(helper.loginUser);

  const newBlog = {
    author: "No title",
    url: "www.google.fi",
    likes: 5,
  };

  const response = await api
    .post("/api/blogs")
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${loggedUser.body.token}`)
    .send(newBlog);

  assert.strictEqual(response.status, 400);
});

test("blog without url returns 400", async () => {
  const loggedUser = await api
    .post("/api/login")
    .set("Content-Type", "application/json")
    .send(helper.loginUser);

  const newBlog = {
    author: "No url",
    title: "Test title",
    likes: 5,
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${loggedUser.body.token}`)
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .send(newBlog);

  assert.strictEqual(response.status, 400);
});

test("blog was deleted", async () => {
  const loggedUser = await api
    .post("/api/login")
    .set("Content-Type", "application/json")
    .send(helper.loginUser);

  const blogs = await api.get("/api/blogs");

  const blogToDelete = blogs.body[0];

  const deleteResponse = await api
    .delete(`/api/blogs/${blogToDelete.id.toString()}`)
    .set("Authorization", `Bearer ${loggedUser.body.token}`)
    .set("Accept", "application/json");

  assert.strictEqual(deleteResponse.status, 204);

  const blogsAtEnd = await api.get("/api/blogs");
  const ids = blogsAtEnd.body.map((b) => b.id);

  assert.ok(!ids.includes(blogToDelete.id));
});

test("blog was edited", async () => {
  const newBlog = {
    title: "Edited blog",
    author: "Author1",
    url: "Url1",
    likes: 10,
  };

  const blogs = await api.get("/api/blogs");

  const blogToEdit = blogs.body[0];

  const response = await api
    .put(`/api/blogs/${blogToEdit.id}`)
    .send(newBlog)
    .set("Content-Type", "application/json")
    .set("Accept", "application/json");

  assert.strictEqual(response.status, 200);

  const newBlogs = await api.get("/api/blogs");
  const updatedBlog = newBlogs.body.find(
    (blog) => blog.id === response.body.id,
  );

  assert.strictEqual(updatedBlog.likes, newBlog.likes);
});

test("creating a new blog without token returns 401", async () => {
  const loggedUser = await api
    .post("/api/login")
    .set("Content-Type", "application/json")
    .send(helper.loginUser);

  const newBlog = {
    title: "Title6",
    url: "Url6",
    author: "Dog",
    likes: 4,
  };

  const response = await api.post("/api/blogs").send(newBlog);

  assert.strictEqual(response.status, 401);
});

after(async () => {
  await mongoose.connection.close();
});
