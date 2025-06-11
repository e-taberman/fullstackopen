const lodash = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + parseInt(blog.likes);
  }, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length < 1) return null;
  return blogs.reduce((fav, blog) => (blog.likes > fav.likes ? blog : fav));
};

const mostBlogs = (blogs) => {
  if (blogs.length < 1) return null;

  const mostPopularAuthor = lodash(blogs)
    .countBy("author")
    .toPairs()
    .maxBy((pair) => pair[1]);

  return { author: mostPopularAuthor[0], blogs: mostPopularAuthor[1] };
};

const mostLikes = (blogs) => {
  if (blogs.length < 1) return null;

  const likesPerAuthor = lodash.map(
    lodash.groupBy(blogs, "author"),
    (authorBlogs, author) => ({
      author,
      likes: lodash.sumBy(authorBlogs, "likes"),
    }),
  );

  return lodash.maxBy(likesPerAuthor, "likes");
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
