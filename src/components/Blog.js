import { useState } from 'react'

const Blog = ({ blog, addLike, delBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }
  //console.log(blog.user.name)
  return (
    <div className='blogStyle'>
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
            <button type='button' onClick={delBlog}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
