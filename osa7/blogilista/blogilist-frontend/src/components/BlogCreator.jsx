import { useState, useEffect } from "react";
import InputField from "./InputField";
import blogService from "../services/blogs";
import PropTypes from "prop-types";

const BlogCreator = ({ onBlogCreation }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [blogCreatorVisible, setBlogCreatorVisible] = useState(false);
  const [newBlog, setNewBlog] = useState(null);

  useEffect(() => {
    const updatedBlog = {
      title: title,
      author: author,
      url: url,
    };
    setNewBlog(updatedBlog);
  }, [title, author, url]);

  const onCreateClick = () => {
    onBlogCreation(newBlog);
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  const hideWhenVisible = { display: blogCreatorVisible ? "none" : "" };
  const showWhenVisible = { display: blogCreatorVisible ? "" : "none" };

  return (
    <div>
      <div style={showWhenVisible}>
        <h2>create new blog</h2>
        <InputField
          id="title"
          text="title:"
          setValue={setTitle}
          inputValue={title}
        >
          title:
        </InputField>
        <InputField
          id="author"
          text="author:"
          setValue={setAuthor}
          inputValue={author}
        ></InputField>
        <InputField
          id="url"
          text="url:"
          setValue={setUrl}
          inputValue={url}
        ></InputField>
        <button
          data-testid="createButton"
          onClick={onCreateClick}
          className="createButton"
        >
          create
        </button>
        <br></br>
        <button onClick={() => setBlogCreatorVisible(false)}>cancel</button>
      </div>
      <div style={hideWhenVisible}>
        <button
          data-testid="newBlog"
          onClick={() => setBlogCreatorVisible(true)}
        >
          new blog
        </button>
      </div>
    </div>
  );
};

BlogCreator.propTypes = {
  onBlogCreation: PropTypes.func.isRequired,
};

export default BlogCreator;
