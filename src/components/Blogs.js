import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { handleCheck, initializeBlogs, sortBlogs } from '../reducers/blogReducer'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Checkbox
} from '@mui/material'

const Blogs = ({ setNotification, clearNotification }) => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  const checking = async (id) => {
    try {
      const blog = blogs.find((b) => b.id === id)
      await dispatch(handleCheck({ id, blog }))

    } catch (error) {
      dispatch(setNotification({
        message: 'Blog was already removed from the server', isError: true
      }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
      dispatch(initializeBlogs())
    }
  }


  return (
    <div>
      <h2>Blogs</h2>
      <button type='button' onClick={() => dispatch(sortBlogs({ sortBy: 'likes', sortOrder: 'desc' }))}>

        sort⬇
      </button>
      <button type='button' onClick={() => dispatch(sortBlogs({ sortBy: 'likes', sortOrder: 'asc' }))}>
        sort⬆
      </button>
      <button type='button' onClick={() => dispatch(sortBlogs({ sortBy: 'user', sortOrder: 'asc' }))}>
        by user
      </button>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                {user.name === blog.user.name ?
                  <TableCell>
                    <Checkbox
                      checked={blog.checked}
                      onChange={() => checking(blog.id)}
                    />
                  </TableCell>
                  : (
                    <TableCell /> // Empty TableCell for layout consistency
                  )
                }
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div >
  )
}

export default Blogs