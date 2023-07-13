import { useDispatch, useSelector } from 'react-redux'
import { logOut } from '../reducers/userReducer'
import { delBlogs } from '../reducers/blogReducer'

const UserManagement = ({ setSuccessMessage, setErrorMessage }) => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)

  const logingOut = () => {
    window.localStorage.clear()
    dispatch(logOut())
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
      } else {
        setErrorMessage('An error occurred while deleting blogs.')
        setTimeout(() => {
          setErrorMessage(null)
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
