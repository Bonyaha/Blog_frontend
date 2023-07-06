import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addingLike, delOneBlog, handleCheck } from '../actions/blogActions'


const Blog = ({ blog, addLike, delOneBlog, user, handleCheck }) => {
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
  //console.log(blog.user.name)
  return (
    <div className='blogStyle'>
      {user.name === blog.user.name && (
        <input
          className='form-check-input m-1'
          type='checkbox'
          id='myCheck'
          checked={blog.checked}
          onChange={handleCheck}
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
                  <button className='delete-button' onClick={delOneBlog}>
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

const Blogs = ({ setNotification, setErrorMessage }) => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)

  const delBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id)
    try {
      await dispatch(delOneBlog([id]))
      setNotification('Deleted  1  blog')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      setErrorMessage(`Blog '${blog.title}' was already removed from server`)
      await dispatch(initializeNotes())
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }
  }

  const addLike = async (id) => {
    const blog = blogs.find((b) => b.id === id)
    try {
      await dispatch(addingLike(id, blog))
    } catch (error) {
      setErrorMessage(`Blog '${blog.title}' was already removed from server`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      await dispatch(delOneBlog([id]))
    }
  }

  const checking = async (id) => {
    try {
      const blog = blogs.find((b) => b.id === id)
      console.log('blog to modify', blog)

      await dispatch(handleCheck(id, blog))

      /* setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)))
      console.log('blogs are after updating:', blogs) */
    } catch (error) {
      setErrorMessage('Blog was already removed from the server')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
    }
  }


  return (
    <ul>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          addLike={() => addLike(blog.id)}
          checking={() => checking(id)}
          delBlog={() => delBlog(blog.id)}
        />
      )}
    </ul>)
}


export default Blogs
