import { useNavigate } from 'react-router-dom'
import useField from '../hooks/useField'


const BlogForm = ({ addBlog }) => {
  const { reset: resetTitle, ...title } = useField('text', true)
  const { reset: resetAuthor, ...author } = useField('text', true)
  const { reset: resetUrl, ...url } = useField('text', true)

  const navigate = useNavigate()


  const onSubmit = (event) => {
    event.preventDefault()
    addBlog({
      title: title.value,
      author: author.value,
      url: url.value,
      checked: false
    })

    navigate('/blogs')
  }

  const handleReset = () => {
    resetTitle()
    resetAuthor()
    resetUrl()
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

        <button type='submit' className='formButton'>save</button>
        <button type='button' className='reset' onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  )
}

export default BlogForm
