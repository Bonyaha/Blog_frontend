import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'


import Blogs from './components/Blogs'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import UserManagement from './components/UserManagement'
import {
  initializeBlogs,

} from './actions/blogActions'
import { sortBlogs } from './actions/blogActions'

import { setUser, logOut } from './actions/userActions'


const App = () => {
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


  const user = useSelector(state => state.user)
  console.log('user is ', user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

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


  return (
    <div>
      <Notification message={errorMessage} isError={true} />
      <Notification message={successMessage} />
      {!user && (
        <>
          <h2>Log in to my application</h2>
          <Togglable buttonLabel='log in'>
            <LoginForm
              setSuccessMessage={setSuccessMessage}
              setErrorMessage={setErrorMessage} />
          </Togglable>
        </>
      )}
      {user && (
        <div>
          <h2>Blogs</h2>
          {user.name} logged in

          <button type='button' onClick={() => dispatch(sortBlogs('likes', 'desc'))}>
            sort⬇
          </button>
          <button type='button' onClick={() => dispatch(sortBlogs('likes', 'asc'))}>
            sort⬆
          </button>
          <UserManagement
            setSuccessMessage={setSuccessMessage}
            setErrorMessage={setErrorMessage}
          />
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm
              blogFormRef={blogFormRef}
              setNotification={setSuccessMessage}
              setErrorMessage={setErrorMessage} />
          </Togglable>
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
