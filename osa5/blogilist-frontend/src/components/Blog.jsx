import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({
    blog,
    user,
    setErrorColor,
    setErrorText,
    updateBlogs
  }) => {
  const [viewInfo, setViewInfo] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: viewInfo ? 'none': '' }
  const showWhenVisible = { display: viewInfo ? '': 'none' }

  const handleLike = async() => {
    const newBlog = {
      "title": blog.title,
      "author": blog.author,
      "url": blog.url,
      "likes": parseInt(blog.likes) + 1
    }
    try {
      await blogService.updateBlog(blog.id, newBlog, user)
    }
    catch(error) {
      console.log(error)
      if (error.response.status === 401) {
        setErrorColor('red')
        setErrorText('unauthorized')
      }
      else {
        setErrorColor('red')
        setErrorText(error)
      }
      return
    }

    setErrorColor('green')
    setErrorText(`"${newBlog.title}" by ${newBlog.author} liked`)
    updateBlogs()
  }

  const handleDelete = async() => {
    if (!confirm(`Do you want to delete "${blog.title}" by ${blog.author}`)){
      return
    }
    try {
      await blogService.deleteBlog(blog.id, user)
    }

    catch(error) {
      console.log(error)
      if (error.response.status === 401) {
        setErrorColor('red')
        setErrorText('unauthorized')
      }
      else {
        setErrorColor('red')
        setErrorText(error)
      }
      return
    }

    setErrorColor('green')
    setErrorText(`"${blog.title}" by ${blog.author} deleted`)
    updateBlogs()
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <div style={blogStyle}>
          <b>{blog.title}, {blog.author}</b> <button onClick={() => setViewInfo(!viewInfo)} >view</button>
        </div>
      </div>

      <div style={showWhenVisible}>
        <div style={blogStyle}>
          <b>{blog.title}, {blog.author}</b> <button onClick={() => setViewInfo(!viewInfo)} >hide</button>
          <br></br>
          {blog.url}
          <br></br>
          {`likes: ${blog.likes}`} <button onClick={handleLike} >like</button>
          <br></br>
          {blog.user.name}
          <br></br>
          {user.username === blog.user.username && (
            <button style={{ backgroundColor: '#ffcccc' }} onClick={handleDelete} >delete</button>
          )}
        </div>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  setErrorColor: PropTypes.func.isRequired,
  setErrorText: PropTypes.func.isRequired,
  updateBlogs: PropTypes.func.isRequired,
}

export default Blog