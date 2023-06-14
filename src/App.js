import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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

  const blogFormRef = useRef(null)

  const handleLogin = async (username, password) => {
    console.log(username)
    console.log(password)
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)

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

  const logOut = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = (blogObject) => {
    if (!blogObject.title || !blogObject.author || !blogObject.url) {
      alert('Please fill in all info')
    }
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        console.log('returned blog is ', returnedBlog)
        setBlogs(blogs.concat(returnedBlog))
        setSuccessMessage(
          `a new blog ${returnedBlog.title} by ${returnedBlog.author} added!`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
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

  const addLike = (id) => {
    const blog = blogs.find((b) => b.id === id)
    const changedBlog = { ...blog, likes: ++blog.likes }
    console.log('changedBlog is ', changedBlog)
    blogService
      .update(id, changedBlog)
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)))
      })
      .catch(() => {
        setErrorMessage(`Blog '${blog.title}' was already removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setBlogs(blogs.filter((b) => b.id !== id))
      })
  }

  return (
    <div>
      <Notification message={errorMessage} isError={true} />
      <Notification message={successMessage} />
      {!user && (
        <>
          <h2>Log in to my application</h2>
          <Togglable buttonLabel='log in'>
            <LoginForm handleLogin={handleLogin} />
          </Togglable>
        </>
      )}
      {user && (
        <div>
          <h2>Blogs</h2>
          {user.name} logged in
          <button
            type='submit'
            style={{ marginLeft: '5px', marginBottom: '15px' }}
            onClick={logOut}
          >
            log out
          </button>
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm addBlog={addBlog} />
          </Togglable>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} addLike={() => addLike(blog.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
