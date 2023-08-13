/* import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addLike, delOneBlog, handleCheck, initializeBlogs } from '../reducers/blogReducer'


const Blog = ({ blog, addingLike, checking, user, delBlog }) => {
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
            <button type='button' onClick={addingLike}>
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
      dispatch(setNotification({
        message: 'Deleted  1  blog', isError: false
      }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    } catch (error) {
      dispatch(setNotification({
        message: `Blog '${blog.title}' was already removed from server`, isError: true
      }))
      await dispatch(initializeBlogs())
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
      return
    }
  }

  const addingLike = async (id) => {
    const blog = blogs.find((b) => b.id === id)
    console.log(blog)
    try {
      await dispatch(addLike({ id, blog }))
    } catch (error) {
      dispatch(setNotification({
        message: `Blog '${blog.title}' was already removed from server`, isError: true
      }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
      await dispatch(delOneBlog([id]))
    }
  }

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
    <>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          addingLike={() => addingLike(blog.id)}
          checking={() => checking(blog.id)}
          delBlog={() => delBlog(blog.id)}
        />
      )}
    </>
  )
}


export default Blogs
 */

import { Link } from 'react-router-dom'
import { useDispatch, } from 'react-redux'
import { handleCheck, initializeBlogs, sortBlogs } from '../reducers/blogReducer'

const Blogs = ({ blogs, setNotification, clearNotification }) => {
  const dispatch = useDispatch()

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




  //const blogs = useSelector(state => state.blogs)
  //const user = useSelector(state => state.user)


  /* const delBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id)
    try {
      await dispatch(delOneBlog([id]))
      dispatch(setNotification({
        message: 'Deleted  1  blog', isError: false
      }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    } catch (error) {
      dispatch(setNotification({
        message: `Blog '${blog.title}' was already removed from server`, isError: true
      }))
      await dispatch(initializeBlogs())
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
      return
    }
  } */

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
            <div className="blogStyle" key={blog.id}>
              <div className="checkboxWrapper">
                <input
                  type='checkbox'
                  id='myCheck'
                  checked={blog.checked}
                  onChange={() => checking(blog.id)}
                ></input>
              </div>
              <li className='blogItem'>
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