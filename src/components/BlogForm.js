import { useDispatch } from 'react-redux'
import { addNewBlog } from '../reducers/blogReducer'
import { logOut } from '../reducers/userReducer'
import { useState } from 'react'

const BlogForm = ({ blogFormRef, setNotification, clearNotification }) => {

  const dispatch = useDispatch()
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const addBlog = async (event) => {
    try {
      event.preventDefault()
      blogFormRef.current.toggleVisibility()
      const blogObject = { ...newBlog, checked: false }
      setNewBlog({ title: '', author: '', url: '' })

      const returnedBlog = await dispatch(addNewBlog(blogObject)).unwrap()
      console.log('returnedBlog is', returnedBlog)
      dispatch(setNotification({
        message: `A new blog ${returnedBlog.title} by ${returnedBlog.author} added!`, isError: false
      }

      ))
      setTimeout(() => {
        dispatch(clearNotification())

      }, 5000)

    } catch (error) {
      if (error.response.data && error.response.data.error === 'token expired') {
        dispatch(setNotification({
          message: 'Session expired.Please log in again.', isError: true
        }))
        setTimeout(() => {
          dispatch(clearNotification())

        }, 5000)
        dispatch(logOut())
        window.localStorage.removeItem('loggedBlogappUser')
      }

    }
  }


  const handleBlogChange = (event, property) => {
    setNewBlog((prevState) => ({
      ...prevState,
      [property]: event.target.value,
    }))
  }

  return (
    <div>
      <h2>Create a new Blog</h2>

      <form onSubmit={addBlog} className='blog-form'>
        <label htmlFor='title'>Title:</label>
        <input
          type='text'
          value={newBlog.title}
          id='title'
          className='form-control'
          onChange={(event) => handleBlogChange(event, 'title')}
          required
        />

        <label htmlFor='author'>Author:</label>
        <input
          type='text'
          value={newBlog.author}
          id='author'
          className='form-control'
          onChange={(event) => handleBlogChange(event, 'author')}
          required
        />

        <label htmlFor='url'>Url:</label>
        <input
          type='text'
          value={newBlog.url}
          id='url'
          className='form-control'
          onChange={(event) => handleBlogChange(event, 'url')}
          required
        />

        <button type='submit'>save</button>
      </form>
    </div>
  )
}

export default BlogForm
