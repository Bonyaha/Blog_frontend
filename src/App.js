import { useState, useEffect } from 'react'
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
import {
  Routes, Route, useNavigate, useMatch
} from 'react-router-dom'



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

  //const blogFormRef = useRef(null)

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
      //blogFormRef.current.toggleVisibility()

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

  const delBlogs = async () => {
    try {
      if (window.confirm('Delete these blogs?')) {
        let blogsToDelete = blogs.filter((n) => n.checked === true)
        console.log('blogsToDelete are', blogsToDelete)

        const blogIds = blogsToDelete.map((b) => b.id)
        await blogService.delBLogs(blogIds)
        const initialBlogs = await blogService.getAll()
        setBlogs(initialBlogs)

        setSuccessMessage(`Deleted ${blogsToDelete.length} ${'blogs'}`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      }
    } catch (error) {
      if (error.response.data.error === 'token expired') {
        setErrorMessage('Session expired. Please log in again.')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setUser(null)
        window.localStorage.removeItem('loggedBlogappUser')
      }
    }
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
      setErrorMessage(`Blog '${blog.title}' was already removed from server`)
      const blogs = await blogService.getAll()
      setBlogs(blogs)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }
  }

  const handleCheck = async (id) => {
    try {
      const blog = blogs.find((b) => b.id === id)
      console.log('blog to modify', blog)
      const changedBlog = { ...blog, checked: !blog.checked }
      console.log('changedBlog is', changedBlog)

      const returnedBlog = await blogService.update(id, changedBlog)
      setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)))
      console.log('blogs are after updating:', blogs)
    } catch (error) {
      setErrorMessage('Blog was already removed from the server')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
    }
  }

  const showDeleteMany = blogs.filter(
    (b) => b.checked === true && b.user.name === user.name
  )

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
                <button type='button' onClick={() => sortedBlogs('likes', 'desc')}>
                  sort⬇
                </button>
                <button type='button' onClick={() => sortedBlogs('likes', 'asc')}>
                  sort⬆
                </button>
                <button
                  type='submit'
                  style={{ marginLeft: '5px', marginBottom: '15px' }}
                  onClick={logOut}
                >
                  log out
                </button>
                {showDeleteMany.length > 1 ? (
                  <button className='btn btn-info ms-2' onClick={() => delBlogs()}>
                    Delete selected
                  </button>
                ) : (
                  ''
                )}
                <Blogs
                  blogs={blogs} />
              </>} />

            <Route path="/blogs/:id" element={
              <Blog
                blog={blog}
                addLike={() => addLike(blog.id)}
                delOneBlog={() => delOneBlog(blog.id)}
                user={user}
                handleCheck={() => handleCheck(blog.id)}
              />} />

            <Route path="/users/:id" element={
              <User

              />} />

            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
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
      {/* {user && (
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
          <button type='button' onClick={() => sortedBlogs('likes', 'desc')}>
            sort⬇
          </button>
          <button type='button' onClick={() => sortedBlogs('likes', 'asc')}>
            sort⬆
          </button>
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm addBlog={addBlog} />
          </Togglable>
          {showDeleteMany.length > 1 ? (
            <button className='btn btn-info ms-2' onClick={() => delBlogs()}>
              Delete selected
            </button>
          ) : (
            ''
          )}
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              addLike={() => addLike(blog.id)}
              delOneBlog={() => delOneBlog(blog.id)}
              user={user}
              handleCheck={() => handleCheck(blog.id)}
            />
          ))}
        </div>
      )} */}
      {/* <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Togglable> */}


    </div>
  )
}

export default App
