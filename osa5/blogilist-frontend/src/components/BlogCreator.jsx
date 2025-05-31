import { useState, useEffect } from 'react'
import InputField from './InputField'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const BlogCreator = ({
    setErrorColor,
    setErrorText,
    updateBlogs,
    user
  }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [blogCreatorVisible, setBlogCreatorVisible] = useState(false)
  const [newBlog, setNewBlog] = useState(null)

  useEffect(() => {
    const updatedBlog = {
      "title": title,
      "author": author,
      "url": url
    };
    setNewBlog(updatedBlog);
  }, [title, author, url]);

  const createNewBlog = async () => {
      try {
        await blogService.postBlog(newBlog, user)
      }
      catch(error) {
        if (error.response.status === 400) {
          setErrorColor('red')
          setErrorText('title or URL missing')
        }
        else if (error.response.status === 401) {
          setErrorColor('red')
          setErrorText('unauthorized')
        }
        return
      }
      setTitle('')
      setAuthor('')
      setUrl('')
      setErrorColor('green')
      setErrorText(`a new blog "${newBlog.title} by ${newBlog.author} added"`)
      updateBlogs()

  }

  const hideWhenVisible = { display: blogCreatorVisible ? 'none': '' }
  const showWhenVisible = { display: blogCreatorVisible ? '': 'none' }

  return (
    <div>
      <div style={showWhenVisible} >
        <h2>create new blog</h2>
        <InputField text="title:" setValue={setTitle} inputValue={title}></InputField>
        <InputField text="author:" setValue={setAuthor} inputValue={author}></InputField>
        <InputField text="url:" setValue={setUrl} inputValue={url}></InputField>
        <button onClick={createNewBlog} >create</button>
        <br></br>
        <button onClick={() => setBlogCreatorVisible(false)}>cancel</button>
      </div>
      <div style={hideWhenVisible}>
        <button onClick={() => setBlogCreatorVisible(true)}>new blog</button>
      </div>
    </div>
  )
}

BlogCreator.propTypes = {
  user: PropTypes.object.isRequired,
  setErrorColor: PropTypes.func.isRequired,
  setErrorText: PropTypes.func.isRequired,
  updateBlogs: PropTypes.func.isRequired,
}

export default BlogCreator