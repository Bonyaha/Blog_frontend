import { useState } from 'react'

const Blog = ({ blog, addLike, delOneBlog, user }) => {
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

export default Blog
