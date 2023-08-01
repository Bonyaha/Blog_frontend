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
  const [user, setUser] = useState('')
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

  const addBlog = async (blogObject) => {
    try {
      await resourceActions.create(blogObject)
      setSuccessMessage(
        `A new blog ${blogObject.title} by ${blogObject.author} added!`
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
      await resourceActions.update(id, changedBlog)
    } catch (error) {
      setErrorMessage(`Blog '${blog.title}' was already removed from server`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const sortedBlogs = (sortBy, sortOrder) => {

    resourceActions.sort(sortBy, sortOrder)
  }

  const delOneBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id)
    try {
      await resourceActions.deleteBlog([id])
      await resourceActions.getAll()
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
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      resourceActions.getAll()
      return
    }
  }

  const delBlogs = async () => {
    try {
      if (window.confirm('Delete these blogs?')) {
        let blogsToDelete = blogs.filter((n) => n.checked === true)
        console.log('blogsToDelete are', blogsToDelete)

        const blogIds = blogsToDelete.map((b) => b.id)
        await resourceActions.deleteBlog(blogIds)
        await resourceActions.getAll()

        setSuccessMessage(`Deleted ${blogsToDelete.length} ${'blogs'}`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      }
    } catch (error) {
      if (error?.response?.data?.error === 'token expired') {
        setErrorMessage('Session expired. Please log in again.')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setUser(null)
        window.localStorage.removeItem('loggedBlogappUser')
      } else {
        console.log(error)
      }
    }
  }

  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null
  //console.log(blog)

  console.log(user)
  const showDeleteMany = blogs.filter(
    (b) => b.checked === true && b.user.name === user.name
  )


  const handleCheck = async (id) => {
    try {
      const blog = blogs.find((b) => b.id === id)
      console.log('blog to modify', blog)
      const changedBlog = { ...blog, checked: !blog.checked }
      console.log('changedBlog is', changedBlog)
      await resourceActions.update(id, changedBlog)
    } catch (error) {
      setErrorMessage('Blog was already removed from the server')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      await resourceActions.getAll()
    }
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
        <>
          <Menu />
          <Routes>
            <Route path="/blogs" element={
              <>
                <button type='button' onClick={() => sortedBlogs('likes', 'desc')}>
                  sort⬆
                </button>
                <button type='button' onClick={() => sortedBlogs('likes', 'asc')}>
                  sort⬇
                </button>
                {showDeleteMany.length > 1 ? (
                  <button className='btn btn-info ms-2' onClick={() => delBlogs()}>
                    Delete selected
                  </button>
                ) : (
                  ''
                )}
                <Blogs
                  blogs={blogs}
                  handleCheck={handleCheck}
                  user={user} />
              </>} />

            <Route path="/blogs/:id" element={
              <Blog
                blog={blog}
                addLike={() => addLike(blog.id)}
                delOneBlog={() => delOneBlog(blog.id)}
                user={user}
              />} />

            <Route path="/users/:id" element={
              <User />} />

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
            <Route path="/users" element={
              <Users
                setSuccessMessage={setSuccessMessage}
                setErrorMessage
                blogFormRef={blogFormRef}
                loggedUser={user}
                setUser={setUser} />
            }
            />

            <Route path="/login" element={
              <Togglable buttonLabel='log in'>
                <LoginForm handleLogin={handleLogin} />
              </Togglable>
            } />

            <Route
              path='/create'
              element={
                <BlogForm addBlog={addBlog} />
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
