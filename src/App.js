import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
useEffect(() => {
  dispatch(initializeNotes())
}, [])

import Blogs from './components/Blogs'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import {
  initializeNotes,

} from './actions/noteActions'

import { setUser, logOut } from './actions/userActions'


const App = () => {
  //const [blogs, setBlogs] = useState([])
  //const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeNotes())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      dispatch(setUser(user))
      blogService.setToken(user.token)

      const tokenExpirationTime = new Date(user.expirationTime)

      if (tokenExpirationTime < new Date()) {
        dispatch(logOut())
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
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))

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

  const logingOut = () => {
    window.localStorage.clear()
    dispatch(logOut())
  }

  /* const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()

      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))
      setSuccessMessage(
        `A new blog ${returnedBlog.title} by ${returnedBlog.author} added!`
      )
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (error) {
      if (error.response.data.error === 'token expired') {
        setErrorMessage('Session expired. Please log in again.')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        dispatch(logOut())
        window.localStorage.removeItem('loggedBlogappUser')
      }
    }
  } */

  /* const addLike = async (id) => {
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
  } */

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
        let blogsToDelete = blogs.filter((b) => b.checked === true)
        console.log('blogsToDelete are', blogsToDelete)

        const blogIds = blogsToDelete.map((b) => b.id)
        await blogService.delBLogs(blogIds)
        await dispatch(initializeNotes())

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
        await dispatch(logOut())
        window.localStorage.removeItem('loggedBlogappUser')
      }
    }
  }

  /* const delOneBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id)
    try {
      await blogService.delBLogs([id])
      const initialBlogs = await blogService.getAll()
      setBlogs(initialBlogs)
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
  } */

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
            onClick={logingOut}
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
            <BlogForm
              blogFormRef={blogFormRef}
              setNotification={setSuccessMessage}
              setErrorMessage={setErrorMessage} />
          </Togglable>
          {showDeleteMany.length > 1 ? (
            <button className='btn btn-info ms-2' onClick={() => delBlogs()}>
              Delete selected
            </button>
          ) : (
            ''
          )}

          <Blogs
            setNotification={setSuccessMessage}
            setErrorMessage={setErrorMessage}
          />

        </div>
      )}
    </div>
  )
}

export default App
