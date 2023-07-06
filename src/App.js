import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'


import Blogs from './components/Blogs'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import {
  initializeBlogs,
  delBlogs
} from './actions/blogActions'

import { setUser, logOut } from './actions/userActions'


const App = () => {
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
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

  const deleteBlogs = async () => {
    try {
      if (window.confirm('Delete these blogs?')) {
        const result = await dispatch(delBlogs())
        setSuccessMessage(`Deleted ${result} ${'blogs'}`)
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
            <button className='btn btn-info ms-2' onClick={() => deleteBlogs()}>
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
