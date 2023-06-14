import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      setUser(user)
      blogService.setToken(user.token)

      const tokenExpirationTime = new Date(user.expirationTime)

      if (tokenExpirationTime < new Date()) {
        setUser(null)
        window.localStorage.removeItem('loggedBlogappUser')
        setErrorMessage('Session expired. Please log in again.')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }, [])

  const addBlog = (event) => {
    event.preventDefault()
    console.log(newBlog)
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    }
    if (!blogObject.title || !blogObject.author || !blogObject.url) {
      alert('Please fill in all info')
    }

    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog))
        setSuccessMessage(
          `a new blog ${returnedBlog.title} by ${returnedBlog.author} added!`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
        setNewBlog({ title: '', author: '', url: '' })
      })
      .catch((error) => {
        if (error.response.data.error === 'token expired') {
          setErrorMessage('Session expired. Please log in again.')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setUser(null)
          window.localStorage.removeItem('loggedBlogappUser')
        }
      })
  }

  const handleBlogChange = (event, property) => {
    setNewBlog({ ...newBlog, [property]: event.target.value })
  }
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage(`Hello ${user.name}👋`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }
    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const logOut = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const blogForm = () => (
    <form onSubmit={addBlog} className='blog-form'>
      <label htmlFor='title'>Title:</label>
      <input
        type='text'
        value={newBlog.title}
        id='title'
        className='form-control'
        onChange={(event) => handleBlogChange(event, 'title')}
        required
      />

      <label htmlFor='author'>Author:</label>
      <input
        type='text'
        value={newBlog.author}
        id='author'
        className='form-control'
        onChange={(event) => handleBlogChange(event, 'author')}
        required
      />

      <label htmlFor='url'>Url:</label>
      <input
        type='text'
        value={newBlog.url}
        id='url'
        className='form-control'
        onChange={(event) => handleBlogChange(event, 'url')}
        required
      />

      <button type='submit'>save</button>
    </form>
  )

  return (
    <div>
      <Notification message={errorMessage} isError={true} />
      <Notification message={successMessage} />
      {!user && (
        <>
          <h3>Log in to an application</h3>
          {loginForm()}
        </>
      )}
      {user && (
        <div>
          <h2>Blogs</h2>
          {user.name} logged in
          <button type='submit' style={{ marginLeft: '5px' }} onClick={logOut}>
            log out
          </button>
          <p>Create new</p>
          {blogForm()}
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
