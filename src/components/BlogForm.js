import { useNavigate } from 'react-router-dom'
import useField from '../hooks'


const BlogForm = ({ addBlog }) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')



  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()

    addBlog({
      title: title.value,
      author: author.value,
      url: url.value, checked: false
    })

    navigate('/blogs')
  }

  return (
    <div>
      <h2>Create a new Blog</h2>

      <form onSubmit={onSubmit} className='blog-form'>
        <label htmlFor='title'>Title:</label>
        <input
          id='title'
          className='form-control'
          {...title}
        />

        <label htmlFor='author'>Author:</label>
        <input
          id='author'
          className='form-control'
          {...author}
        />

        <label htmlFor='url'>Url:</label>
        <input
          id='url'
          className='form-control'
          {...url}
        />

        <button type='submit'>save</button>
      </form>
    </div>
  )
}

export default BlogForm
