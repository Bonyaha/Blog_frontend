import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addingLike, delOneBlog, handleCheck, initializeBlogs } from '../actions/blogActions'


const Blog = ({ blog, addLike, checking, user, delBlog }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleDeletion = () => {
    setShowModal(true)
  }
  const cancelDeletion = () => {
    setShowModal(false)
  }

  return (
    <div className='blogStyle'>
      {user.name === blog.user.name && (
        <input
          className='form-check-input m-1'
          type='checkbox'
          id='myCheck'
          checked={blog.checked}
          onChange={checking}
        ></input>
      )}
      <p className='blog'>
        {blog.title} {blog.author}
        <button
          type='button'
          onClick={toggleDetails}
          style={{ marginLeft: '5px' }}
        >
          {showDetails ? 'hide' : 'view'}
        </button>
      </p>
      {showDetails && (
        <div>
          <p>Url: {blog.url}</p>
          <p>
            Likes: {blog.likes}
            <button type='button' onClick={addLike}>
              like
            </button>
          </p>
          <p>{blog.user.name}</p>
          {user.name === blog.user.name && (
            <button type='button' onClick={() => handleDeletion()}>
              remove
            </button>
          )}

          {showModal && (
            <div className='modal-overlay'>
              <div className='modal'>
                <h2>Confirm Deletion</h2>
                <div className='button-container'>
                  <button className='cancel-button' onClick={cancelDeletion}>
                    Cancel
                  </button>
                  <button className='delete-button' onClick={delBlog}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const Blogs = ({ setNotification, clearNotification }) => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  const delBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id)
    try {
      await dispatch(delOneBlog([id]))
      dispatch(setNotification('Deleted  1  blog',false))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    } catch (error) {
      dispatch(setNotification(`Blog '${blog.title}' was already removed from server`,true))
      await dispatch(initializeBlogs())
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
      return
    }
  }

  const addLike = async (id) => {
    const blog = blogs.find((b) => b.id === id)
    try {
      await dispatch(addingLike(id, blog))
    } catch (error) {
      dispatch(setNotification(`Blog '${blog.title}' was already removed from server`,true))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
      await dispatch(delOneBlog([id]))
    }
  }

  const checking = async (id) => {
    try {
      const blog = blogs.find((b) => b.id === id)
      await dispatch(handleCheck(id, blog))

    } catch (error) {
      dispatch(setNotification('Blog was already removed from the server',true))
      setTimeout(() => {
       dispatch(clearNotification())
      }, 5000)
      await dispatch(initializeBlogs())
    }
  }


  return (
    <>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          addLike={() => addLike(blog.id)}
          checking={() => checking(blog.id)}
          delBlog={() => delBlog(blog.id)}
        />
      )}
    </>
  )
}


export default Blogs
