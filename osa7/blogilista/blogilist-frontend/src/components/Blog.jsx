import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

const Blog = ({ blog, user, onLikeClick, onDeleteClick }) => {
  const [viewInfo, setViewInfo] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const hideWhenVisible = { display: viewInfo ? "none" : "" };
  const showWhenVisible = { display: viewInfo ? "" : "none" };

  return (
    <div>
      <div style={hideWhenVisible}>
        <div style={blogStyle} className="blog">
          <b>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title}, {blog.author}
            </Link>
          </b>{" "}
          {/* <button onClick={() => setViewInfo(!viewInfo)}>view</button> */}
        </div>
      </div>

      <div style={showWhenVisible}>
        <div style={blogStyle} className="blogDetails">
          <b>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title}, {blog.author}
            </Link>
          </b>{" "}
          <button onClick={() => setViewInfo(!viewInfo)}>hide</button>
          <br></br>
          {blog.url}
          <br></br>
          {`likes: ${blog.likes}`}{" "}
          <Button onClick={() => onLikeClick(blog)}>like</Button>
          <br></br>
          {blog.user.name}
          <br></br>
          {user.username === blog.user.username && (
            <button
              style={{ backgroundColor: "#ffcccc" }}
              onClick={() => onDeleteClick(blog)}
            >
              delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onLikeClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default Blog;
