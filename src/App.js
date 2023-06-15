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

    setBlogs(sorted)
  }

  const delBlog = async (id) => {
    let num = 1
    if (!id) {
      if (window.confirm('Delete these blogs?')) {
        let blogsToDelete = blogs.filter((n) => n.checked === true)
        if (blogsToDelete.length > 0) {
          num = blogsToDelete.length
          const blogIds = blogsToDelete.map((n) => n.id)
          await blogService.delBLogs(blogIds)
          const initialBlogs = await blogService.getAll()
          setBlogs(initialBlogs)
        }
      }
    } else {
      if (window.confirm('Delete this blog?')) {
        await blogService.delBLogs([id])
        const initialBlogs = await blogService.getAll()
        setBlogs(initialBlogs)
      }
    }
    setSuccessMessage(`Deleted ${num} ${num > 1 ? 'notes' : 'note'}`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
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
          <button type='button' onClick={() => sortedBlogs('likes', 'desc')}>
            sort⬇
          </button>
          <button type='button' onClick={() => sortedBlogs('likes', 'asc')}>
            sort⬆
          </button>
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm addBlog={addBlog} />
          </Togglable>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              addLike={() => addLike(blog.id)}
              delBlog={() => delBlog(blog.id)}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
