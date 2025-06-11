const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

const emptyList = [];

const listWithOneBlog = [
  {
    _id: "23k5nj36jk546k456kj4k645",
    title: "Epic Blog 1",
    author: "Blog Person",
    url: "http://www.blog.com/1",
    likes: 10,
    __v: 0,
  },
];

const listWithLotsOfBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

test("dummy returns one", () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);

  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  const result = listHelper.totalLikes(emptyList);
  test("of empty list is zero", () => {
    assert.strictEqual(result, 0);
  });

  const result2 = listHelper.totalLikes(listWithOneBlog);
  test("when list has only one blog equals to the likes of that", () => {
    assert.strictEqual(result2, 10);
  });

  const result3 = listHelper.totalLikes(listWithLotsOfBlogs);
  test("öf a bigger list is calculated right", () => {
    assert.strictEqual(result3, 36);
  });
});

describe("favorite blog", () => {
  const result = listHelper.favoriteBlog([]);
  test("of an empty list is null", () => {
    assert.strictEqual(result, null);
  });

  const result3 = listHelper.favoriteBlog(listWithLotsOfBlogs);
  test("of a list with many blogs is the one with the most likes", () => {
    assert.deepStrictEqual(result3, listWithLotsOfBlogs[2]);
  });
});

describe("most blogs", () => {
  const result = listHelper.mostBlogs([]);
  test("in an empty list is null", () => {
    assert.strictEqual(result, null);
  });

  const result2 = listHelper.mostBlogs(listWithOneBlog);
  test("in a list with one blog is the first one", () => {
    assert.deepStrictEqual(result2, { author: "Blog Person", blogs: 1 });
  });

  const result3 = listHelper.mostBlogs(listWithLotsOfBlogs);
  test("in a bigger list is correct", () => {
    assert.deepStrictEqual(result3, { author: "Robert C. Martin", blogs: 3 });
  });
});

describe("most likes", () => {
  test("in an empty list is null", () => {
    assert.strictEqual(listHelper.mostLikes([]), null);
  });
  test("in a list with one object is the author and likes of that object", () => {
    assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), {
      author: "Blog Person",
      likes: 10,
    });
  });
  test("in a long is the author with the most total likes", () => {
    assert.deepStrictEqual(listHelper.mostLikes(listWithLotsOfBlogs), {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
