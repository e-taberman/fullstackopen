import { useState, useEffect } from "react";
import InputField from "./InputField";
import PropTypes from "prop-types";
import Table from "react-bootstrap/Table";

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
        <h2>Create new blog</h2>
        <InputField
          id="title"
          text="Title:"
          setValue={setTitle}
          inputValue={title}
        >
          {/* title: */}
        </InputField>
        <InputField
          id="author"
          text="Author:"
          setValue={setAuthor}
          inputValue={author}
        ></InputField>
        <InputField
          id="url"
          text="URL:"
          setValue={setUrl}
          inputValue={url}
        ></InputField>
        <br></br>
        <button
          data-testid="createButton"
          onClick={onCreateClick}
          className="createButton"
        >
          create
        </button>
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
