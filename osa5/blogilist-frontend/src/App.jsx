import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const InputField = (props) => {
  return (
    <div>
      {props.text} <input type="text" onChange={event => props.setValue(event.target.value)} ></input>
    </div>
  )
}

const Notification = (props) => {
  const notificationStyle = {
    color: props.color || "red",
    fontWeight: "bold",
    borderStyle: "solid",
    padding: "5px",
    marginBottom: "10px"
  }

  useEffect(() => {
    if (props.message) {
      const timer = setTimeout(() => {
        props.setErrorText("")
      }, 2000)
      return () => clearTimeout(timer);
    }
  })

  if (props.message !== "") return <div style={notificationStyle}>{props.message}</div>
  else return <div>{props.message}</div>
}

const BlogCreator = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    const updatedBlog = {
      "title": title,
      "author": author,
      "url": url
    };
    props.setNewBlog(updatedBlog);
  }, [title, author, url]);

  return (
    <div>
      <h2>create new blog</h2>
      <InputField text="title:" setValue={setTitle}></InputField>
      <InputField text="author:" setValue={setAuthor}></InputField>
      <InputField text="url:" setValue={setUrl}></InputField>
      <button onClick={props.onSubmit} >create</button>
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [newBlog, setNewBlog] = useState(null)
  const [errorText, setErrorText] = useState("")
  const [errorColor, setErrorColor] = useState("red")

  useEffect(() => { updateBlogs()}, [])

  const updateBlogs = () => {
    blogService
      .getAll()
      .then((blogs) => {
        setBlogs(blogs)
      })
      .then(() => {
        automaticLogin()
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
        setToken(response.token)
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
        const loginUser = JSON.stringify({"username": username, "password": password})
        setToken(response.token)
        setUser(response)
        window.localStorage.setItem('user', loginUser)
      })
      .catch(error => {
        if (error.request.status === 401) {
          setErrorColor('red')
          setErrorText('wrong username or password')
        }
      })
  }

  const createNewBlog = async () => {
    try {
      const request = await blogService.postBlog(newBlog, user)
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

  if (user === null) {
    return (
    <div>
      <h2>login to application</h2>
      <Notification message={errorText} setErrorText={setErrorText} color={errorColor} />
      <InputField text="username" setValue={setUsername} />
      <InputField text="password" setValue={setPassword} />
      <button onClick={handleLogin} >login</button>
    </div>
  )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorText} setErrorText={setErrorText} color={errorColor} />
      <div>{user.name} has logged in <button onClick={handleLogout}>logout</button></div><br></br>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      <BlogCreator setNewBlog={setNewBlog} onSubmit={createNewBlog}/><br></br>
    </div>
  )
}

export default App