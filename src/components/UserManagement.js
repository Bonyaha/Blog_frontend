import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import { makeStyles } from '@mui/styles'
import { logOut } from '../reducers/userReducer'
import { initializeBlogs, deleteMany } from '../reducers/blogReducer'

const useStyles = makeStyles({
  logOutButton: {
    marginLeft: '5px',
    marginBottom: '15px',
  },
  deleteButton: {
    marginLeft: '5px',
    marginBottom: '15px',
  },
})


const UserManagement = ({ setNotification, clearNotification }) => {
  const [showModal, setShowModal] = useState(false)

  const classes = useStyles()

  const handleDeletion = () => {
    setShowModal(true)
  }
  const cancelDeletion = () => {
    setShowModal(false)
  }


  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)

  const logingOut = () => {
    window.localStorage.clear()
    dispatch(logOut())
  }

  const deleteBlogs = async () => {
    try {
      cancelDeletion()
      const result = await dispatch(deleteMany(blogs)).unwrap()
      dispatch(setNotification({
        message: `Deleted ${result.length} ${'blogs'}`, isError: false
      }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)

    } catch (error) {
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

  const showDeleteMany = blogs.filter(
    (b) => b.checked === true
  )

  return (
    <>
      {/* <button
        type='submit'
        style={{ marginLeft: '5px', marginBottom: '15px' }}
        onClick={logingOut}
      >
        log out
      </button> */}
      <Button
        variant="contained"
        color="secondary"
        className={classes.logOutButton}
        onClick={logingOut}
      >
        Log Out
      </Button>
      {showDeleteMany.length > 0 ? (
        <Button
          variant="contained"
          color="info"
          /* className={`${classes.deleteButton} btn btn-info`} */
          className={classes.deleteButton}
          onClick={() => handleDeletion()}
        >
          Delete selected
        </Button>
      ) : (
        ''
      )}
      {showModal && (
        <div className='modal-overlay'>
          <div className='modal'>
            <h2>Confirm Deletion</h2>
            <div className='button-container'>
              <button className='cancel-button' onClick={cancelDeletion}>
                Cancel
              </button>
              <button className='delete-button' onClick={() => deleteBlogs()}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


export default UserManagement
