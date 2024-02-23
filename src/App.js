import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Routes, Route, useMatch
} from 'react-router-dom'
import Blogs from './components/Blogs'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
//import UserManagement from './components/UserManagement'
import {
  initializeBlogs
} from './reducers/blogReducer'
import { setNotification, clearNotification } from './reducers/notificationReducer'
import { setUser, logOut } from './reducers/userReducer'
import Menu from './components/Menu'
import Footer from './components/Footer'
import About from './components/About'
import Blog from './components/Blog'
import User from './components/User'
import Home from './components/Home'
import Users from './components/Users'
import UserManagement from './components/UserManagement'
import { Container } from '@mui/material'


const App = () => {

  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs)
  const notification = useSelector(state => state.notification)

  const dispatch = useDispatch()

  // Function to check token expiration
  const checkTokenExpiration = () => {
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
  }

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    checkTokenExpiration()
  }, [])

  const blogFormRef = useRef(null)


  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  return (
    <Container>
      <Notification message={notification.message} isError={notification.isError} />
      {
        !user && (
          <>
            <h2>Log in to my application</h2>
            <Togglable buttonLabel='log in'>
              <LoginForm
                setNotification={setNotification}
                clearNotification={clearNotification} />
            </Togglable>
          </>
        )
      }
      {
        user && (
          <div onClick={checkTokenExpiration}>
            <Menu />
            {user.name} logged in
            <div className='userManagement'>
              <UserManagement
                setNotification={setNotification}
                clearNotification={clearNotification}
              />
            </div>
            <Routes>
              <Route path="/blogs" element={
                <Blogs

                  setNotification={setNotification}
                  clearNotification={clearNotification} />
              } />

              <Route path="/blogs/:id" element={
                <Blog
                  blog={blog}
                  user={user}
                  setNotification={setNotification}
                  clearNotification={clearNotification}
                />} />
              <Route path="/users/:id" element={
                <User />} />

              <Route path="/" element={
                <Home />
              } />
              <Route path="/users" element={
                <Users
                  setNotification={setNotification}
                  clearNotification={clearNotification}
                  blogFormRef={blogFormRef} />} />

              <Route path="/login" element={
                <Togglable buttonLabel='log in'>
                  <LoginForm
                    setNotification={setNotification}
                    clearNotification={clearNotification} />
                </Togglable>
              } />
              <Route
                path='/create'
                element={
                  <BlogForm
                    setNotification={setNotification}
                    clearNotification={clearNotification} />
                }
              />
              <Route path='/about' element={<About />} />
            </Routes>
          </div>
        )
      }

      <Footer />
    </Container >
  )
}

export default App
