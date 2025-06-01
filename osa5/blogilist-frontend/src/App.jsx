import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import InputField from './components/InputField'
import Notification from './components/Notification'
import BlogCreator from './components/BlogCreator'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorText, setErrorText] = useState('')
  const [errorColor, setErrorColor] = useState('red')

  useEffect(() => { updateBlogs()}, [])

  const updateBlogs = () => {
    blogService
      .getAll()
      .then((blogs) => {
        setBlogs(blogs)
      })
      .then(() => {
        if (user === null) automaticLogin()
      })
  }

  const automaticLogin = () => {
    const localStorage = window.localStorage.getItem('user')

    if (localStorage === null) return

    const parsed = JSON.parse(localStorage)
    setUsername(parsed.username)
    setPassword(parsed.password)

    loginService
      .login(parsed.username, parsed.password)
      .then((response) => {
        setUser(response)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('user')
  }

  const handleLogin = () => {
    loginService
      .login(username, password)
      .then((response) => {
        const loginUser = JSON.stringify({'username': username, 'password': password})
        setUser(response)
        window.localStorage.setItem('user', loginUser)
        setUsername('')
        setPassword('')
      })
      .catch(error => {
        if (error.request.status === 401) {
          setErrorColor('red')
          setErrorText('wrong username or password')
        }
      })
  }

  const onLikeClick = async(blog) => {
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

  const onDeleteClick = async(blog) => {
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

  const createNewBlog = async (newBlog) => {
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
    setErrorColor('green')
    setErrorText(`a new blog "${newBlog.title} by ${newBlog.author} added"`)
    updateBlogs()
  }

  // NOT LOGGED IN
  if (user === null) {
    return (
    <div>
      <h2>login to application</h2>
      <Notification message={errorText} setErrorText={setErrorText} color={errorColor} />
      <InputField id='username' text='username' setValue={setUsername} inputValue={username}/>
      <InputField id='password' text='password' setValue={setPassword} inputValue={password} />
      <button onClick={handleLogin} >login</button>
    </div>
  )
  }

  // LOGGED IN
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorText} setErrorText={setErrorText} color={errorColor} />
      <div>{user.name} has logged in <button onClick={handleLogout}>logout</button></div><br></br>

      <BlogCreator setErrorColor={setErrorColor}
                   setErrorText={setErrorText}
                   updateBlogs={updateBlogs}
                   user={user}
                   onBlogCreation={createNewBlog}/><br></br>

      {blogs.slice().sort((a, b) => b.likes - a.likes)
      .map(blog =>
        <Blog
            key={blog.id}
            blog={blog}
            user={user}
            setErrorColor={setErrorColor}
            setErrorText={setErrorText}
            updateBlogs={updateBlogs}
            onLikeClick={onLikeClick}
            onDeleteClick={onDeleteClick}
          />
      )}

    </div>
  )
}

export default App