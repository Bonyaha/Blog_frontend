import { useState } from 'react'

const Blog = ({ blog, addLike, delOneBlog, user, handleCheck }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
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
      <p>
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
          <p>{blog.url}</p>
          <p>
            Likes: {blog.likes}
            <button type='button' onClick={addLike}>
              like
            </button>
          </p>
          <p>{blog.user.name}</p>
          {user.name === blog.user.name && (
            <button type='button' onClick={delOneBlog}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
