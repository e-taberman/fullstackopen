const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const testBlogs = [
  {
    title: "Title1",
    author: "Author1",
    url: "Url1",
    likes: 1,
  },
  {
    title: "Title2",
    author: "Author2",
    url: "Url2",
    likes: 2,
  },
  {
    title: "Title3",
    author: "Author3",
    url: "Url3",
    likes: 3,
  },
];

const testUsers = [
  {
    name: "Bob",
    username: "bob543",
    _id: "68371bae27751578a2f74355",
    passwordHash:
      "$2b$10$ebqps04z075DpqEG.FcJQ.0f6938smFLi.1zR1hANP9G9m4AhbS2u",
  },
];

const loginUser = {
  name: "Name",
  username: "loginUser",
  password: "pass",
};

const getBlogsInDb = async () => {
  const blogs = await Blog.find({});

  return blogs.map((blog) => blog.toJSON());
};

const getLoggedUser = async (api) => {
  return await api
    .post("/api/login")
    .set("Content-Type", "application/json")
    .send(helper.loginUser);
};

module.exports = {
  getBlogsInDb,
  testBlogs,
  testUsers,
  loginUser,
  getLoggedUser,
};
