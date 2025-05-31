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

  // NOT LOGGED IN
  if (user === null) {
    return (
    <div>
      <h2>login to application</h2>
      <Notification message={errorText} setErrorText={setErrorText} color={errorColor} />
      <InputField text='username' setValue={setUsername} inputValue={username}/>
      <InputField text='password' setValue={setPassword} inputValue={password} />
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
                   user={user} /><br></br>
      {blogs.slice().sort((a, b) => b.likes - a.likes)
      .map(blog =>
        <Blog
            key={blog.id}
            blog={blog}
            user={user}
            setErrorColor={setErrorColor}
            setErrorText={setErrorText}
            updateBlogs={updateBlogs}
          />
      )}

    </div>
  )
}

export default App