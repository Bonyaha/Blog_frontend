import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addNewBlog } from '../reducers/blogReducer'
import { logOut } from '../reducers/userReducer'
import { useState } from 'react'
import { TextField, Button, Grid } from '@mui/material'

const BlogForm = ({ setNotification, clearNotification }) => {
  const dispatch = useDispatch()
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const navigate = useNavigate()

  const addBlog = async (event) => {
    try {
      event.preventDefault()
      const blogObject = { ...newBlog, checked: false }
      setNewBlog({ title: '', author: '', url: '' })

      const returnedBlog = await dispatch(addNewBlog(blogObject)).unwrap()
      console.log('returnedBlog is', returnedBlog)
      navigate('/blogs')
      dispatch(setNotification({
        message: `A new blog ${returnedBlog.title} by ${returnedBlog.author} added!`, isError: false
      }
      ))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)

    } catch (error) {
      console.log(error)
      dispatch(setNotification({
        message: error, isError: true
      }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
      dispatch(logOut())
      window.localStorage.removeItem('loggedBlogappUser')
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

      <form onSubmit={addBlog} >
        <Grid container spacing={1}>
          <Grid item xs={10} >
            <TextField
              label='Title'
              variant='outlined'
              fullWidth
              value={newBlog.title}
              onChange={(event) => handleBlogChange(event, 'title')}
              required
            />
          </Grid>
          <Grid item xs={10} >
            <TextField
              label='Author'
              variant='outlined'
              fullWidth
              value={newBlog.author}
              onChange={(event) => handleBlogChange(event, 'author')}
              required
            />
          </Grid>
          <Grid item xs={10}>
            <TextField
              label='Url'
              variant='outlined'
              fullWidth
              value={newBlog.url}
              onChange={(event) => handleBlogChange(event, 'url')}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type='submit' variant='contained' color='primary'>
              save
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default BlogForm
