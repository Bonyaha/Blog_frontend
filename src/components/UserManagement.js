import { useDispatch, useSelector } from 'react-redux'
import { logOut } from '../reducers/userReducer'
import { initializeBlogs, deleteMany } from '../reducers/blogReducer'

const UserManagement = ({ setNotification, clearNotification }) => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)

  const logingOut = () => {
    window.localStorage.clear()
    dispatch(logOut())
  }

  const deleteBlogs = async () => {
    try {
      if (window.confirm('Delete these blogs?')) {
        const result = await dispatch(deleteMany(blogs)).unwrap()
        dispatch(setNotification({
          message: `Deleted ${result.length} ${'blogs'}`, isError: false
        }))
        setTimeout(() => {
          dispatch(clearNotification())
        }, 5000)
      }
    } catch (error) {
      if (error.response?.data?.error === 'token expired') {
        dispatch(setNotification({
          message: 'Session expired.Please log in again.', isError: true
        }))
        setTimeout(() => {
          dispatch(clearNotification())
        }, 5000)
        await dispatch(logOut())
        window.localStorage.removeItem('loggedBlogappUser')
      } else {
        console.log(error)
        dispatch(setNotification({
          message: 'An error occurred while deleting blogs', isError: true
        }))
        setTimeout(() => {
          dispatch(clearNotification())
        }, 5000)
        dispatch(initializeBlogs())
      }
    }
  }
  const showDeleteMany = blogs.filter(
    (b) => b.checked === true
  )

  return (
    <>
      <button
        type='submit'
        style={{ marginLeft: '5px', marginBottom: '15px' }}
        onClick={logingOut}
      >
        log out
      </button>
      {showDeleteMany.length > 1 ? (
        <button className='btn btn-info ms-2' onClick={() => deleteBlogs()}>
          Delete selected
        </button>
      ) : (
        ''
      )}
    </>
  )
}


export default UserManagement
