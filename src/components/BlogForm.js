import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const onSubmit = (event) => {
    event.preventDefault()

    addBlog({ ...newBlog, checked: false })
    setNewBlog({ title: '', author: '', url: '' })
  }
  const handleBlogChange = (event, property) => {
    setNewBlog((prevState) => ({
      ...prevState,
      [property]: event.target.value,
    }))
  }
  return (
    <div>
      <h2>Create a new Blog</h2>

      <form onSubmit={onSubmit} className='blog-form'>
        <label htmlFor='title'>Title:</label>
        <input
          type='text'
          value={newBlog.title}
          id='title'
          className='form-control'
          onChange={(event) => handleBlogChange(event, 'title')}
          required
        />

        <label htmlFor='author'>Author:</label>
        <input
          type='text'
          value={newBlog.author}
          id='author'
          className='form-control'
          onChange={(event) => handleBlogChange(event, 'author')}
          required
        />

        <label htmlFor='url'>Url:</label>
        <input
          type='text'
          value={newBlog.url}
          id='url'
          className='form-control'
          onChange={(event) => handleBlogChange(event, 'url')}
          required
        />

        <button type='submit'>save</button>
      </form>
    </div>
  )
}

export default BlogForm
