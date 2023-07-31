import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Home from './components/Home'
import Menu from './components/Menu'
import About from './components/About'
import Users from './components/Users'
import User from './components/User'
import Blogs from './components/Blogs'
import Footer from './components/Footer'
import {
  Routes, Route, useNavigate, useMatch
} from 'react-router-dom'
import useResource from './hooks/useResource'


const App = () => {
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const token = user ? user.token : null
  const [blogs, resourceActions] = useResource(token)

  useEffect(() => {
    resourceActions.getAll()
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

  const navigate = useNavigate()

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      navigate('/')

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
    console.log('test')
    window.localStorage.clear()
    setUser(null)
  }

  /* const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))
      setSuccessMessage(
        `A new blog ${returnedBlog.title} by ${returnedBlog.author} added!`
      )
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (error) {
      if (error.response && error.response.data.error === 'token expired') {
        setErrorMessage('Session expired. Please log in again.')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setUser(null)
        window.localStorage.removeItem('loggedBlogappUser')
      }
      console.log(error)
    }
  }


  const addLike = async (id) => {
    const blog = blogs.find((b) => b.id === id)
    try {
      const changedBlog = { ...blog, likes: ++blog.likes }
      console.log('changedBlog is ', changedBlog)

      const returnedBlog = await blogService.update(id, changedBlog)
      setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)))
    } catch (error) {
      setErrorMessage(`Blog '${blog.title}' was already removed from server`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setBlogs(blogs.filter((b) => b.id !== id))
    }
  }

  const sortedBlogs = (sortBy, sortOrder) => {
    //we need to create a new array before sorting it, that's why we use spread on blogs
    const sorted = [...blogs].sort((a, b) => {
      const sortValueA = a[sortBy]
      const sortValueB = b[sortBy]

      if (sortOrder === 'desc') {
        return sortValueB - sortValueA
      } else {
        return sortValueA - sortValueB
      }
    })
    console.log('sorted blogs are ', sorted)
    setBlogs(sorted)
  }

  const delOneBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id)
    try {
      await blogService.delBLogs([id])
      const initialBlogs = await blogService.getAll()
      setBlogs(initialBlogs)
      navigate('/blogs')
      setSuccessMessage('Deleted  1  blog')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (error) {
      if (error.response && error.response.data.error === 'token expired') {
        setErrorMessage('Session expired. Please log in again.')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setUser(null)
        window.localStorage.removeItem('loggedBlogappUser')
        return
      }
      setErrorMessage(`Blog '${blog.title}' was already removed from server`)
      const blogs = await blogService.getAll()
      setBlogs(blogs)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }
  }
 */
  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null
  //console.log(blog)
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
        <>
          <Menu />
          <Routes>
            <Route path="/blogs" element={
              <>
                <button type='button' /* onClick={() => sortedBlogs('likes', 'desc')} */>
                  sort⬇
                </button>
                <button type='button' /* onClick={() => sortedBlogs('likes', 'asc')} */>
                  sort⬆
                </button>
                <Blogs
                  blogs={blogs} />
              </>} />

            <Route path="/blogs/:id" element={
              <Blog
                blog={blog}
                /* addLike={() => addLike(blog.id)}
                delOneBlog={() => delOneBlog(blog.id)} */
                user={user}
              />} />

            <Route path="/users/:id" element={
              <User

              />} />

            <Route path="/" element={
              <>
                <button
                  type='submit'
                  style={{ marginLeft: '5px', marginBottom: '15px' }}
                  onClick={logOut}
                >
                  log out
                </button>
                <Home />
              </>
            } />
            <Route path="/users" element={<Users
              setSuccessMessage={setSuccessMessage}
              setErrorMessage
              blogFormRef={blogFormRef} />} />

            <Route path="/login" element={
              <Togglable buttonLabel='log in'>
                <LoginForm handleLogin={handleLogin} />
              </Togglable>

            } />
            <Route
              path='/create'
              element={
                <BlogForm /* addBlog={addBlog} */ />
              }
            />
            <Route path='/about' element={<About />} />

          </Routes>
        </>
      )}

      <div>
        <Footer />
      </div>
    </div>
  )
}

export default App
