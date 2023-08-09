import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'


import Blogs from './components/Blogs'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import UserManagement from './components/UserManagement'
import {
  initializeBlogs, sortBlogs
} from './reducers/blogReducer'

import { setNotification, clearNotification } from './reducers/notificationReducer'

import { setUser, logOut } from './reducers/userReducer'


const App = () => {
  const user = useSelector(state => state.user)
  const notification = useSelector(state => state.notification)

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
        dispatch(setNotification({
          message: 'Session expired.Please log in again.', isError: true
        }))
        setTimeout(() => {
          dispatch(clearNotification())
        }, 5000)
      }
    }
  }, [])

  const blogFormRef = useRef(null)


  return (
    <div>
      <Notification message={notification.message} isError={notification.isError} />
      {!user && (
        <>
          <h2>Log in to my application</h2>
          <Togglable buttonLabel='log in'>
            <LoginForm
              setNotification={setNotification}
              clearNotification={clearNotification} />
          </Togglable>
        </>
      )}
      {user && (
        <div>
          <h2>Blogs</h2>
          {user.name} logged in

          <button type='button' onClick={() => dispatch(sortBlogs({ sortBy: 'likes', sortOrder: 'desc' }))}>

            sort⬇
          </button>
          <button type='button' onClick={() => dispatch(sortBlogs({ sortBy: 'likes', sortOrder: 'asc' }))}>
            sort⬆
          </button>
          <UserManagement
            setNotification={setNotification}
            clearNotification={clearNotification}
          />
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm
              blogFormRef={blogFormRef}
              setNotification={setNotification}
              clearNotification={clearNotification} />
          </Togglable>
          <Blogs
            setNotification={setNotification}
            clearNotification={clearNotification}
          />

        </div>
      )}
    </div>
  )
}

export default App
