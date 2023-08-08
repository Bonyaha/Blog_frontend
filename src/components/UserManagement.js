import { useDispatch, useSelector } from 'react-redux'
import { logOut } from '../actions/userActions'
import { delBlogs } from '../actions/blogActions'

const UserManagement = ({ setNotification, clearNotification }) => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)

  const logingOut = () => {
    dispatch(logOut())
  }

  const deleteBlogs = async () => {
    try {
      if (window.confirm('Delete these blogs?')) {
        const result = await dispatch(delBlogs())
        dispatch(setNotification(`Deleted ${result} ${'blogs'}`,false))
        setTimeout(() => {
          dispatch(clearNotification())
        }, 5000)
      }
    } catch (error) {
      if (error.response.data.error === 'token expired') {
        dispatch(setNotification('Session expired. Please log in again.',true))
        setTimeout(() => {
          dispatch(clearNotification())
        }, 5000)
        await dispatch(logOut())
        window.localStorage.removeItem('loggedBlogappUser')
      } else {
        dispatch(setNotification('An error occurred while deleting blogs.',true))
        setTimeout(() => {
          dispatch(clearNotification())
        }, 5000)
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
