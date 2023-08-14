import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { handleCheck, initializeBlogs, sortBlogs } from '../reducers/blogReducer'

const Blogs = ({ blogs, setNotification, clearNotification }) => {
  const dispatch = useDispatch()
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
      <div >
        <ul >

          {blogs.map((blog) => (
            <div className='blogStyle' key={blog.id}>
              <div className="checkboxWrapper">

              </div>
              <li className='blogItem'>
                {user.name === blog.user.name && (
                  <input
                    type='checkbox'
                    id='myCheck'
                    checked={blog.checked}
                    onChange={() => checking(blog.id)}
                  ></input>
                )}
                <Link to={`/blogs/${blog.id}`} className='linkStyle '>{blog.title}</Link>
              </li>

            </div>
          ))}
        </ul>
      </div >
    </div >
  )
}

export default Blogs