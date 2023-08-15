import { useDispatch, useSelector } from 'react-redux'
import { addLike, delOneBlog } from '../reducers/blogReducer'
import CommentForm from './commentsForm'

const Blog = ({ blog, setNotification, clearNotification }) => {


	const dispatch = useDispatch()
	const blogs = useSelector(state => state.blogs)

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

	if (!blog) {
		return null
	}

	const formatDate = (dateString) => {
		const options = {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}

		const formattedDate = new Date(dateString).toLocaleDateString(undefined, options)
		const formattedTime = new Date(dateString).toLocaleTimeString(undefined, {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
		})

		return `${formattedDate} at ${formattedTime.toLowerCase()}`
	}

	return (
		<div >
			<h3>
				{blog.title} by {blog.author}
			</h3>

			<div>
				<a href={blog.url} target="_blank" rel="noopener noreferrer">
					{blog.url}
				</a>
				<p>
					{blog.likes} likes
					<button type='button' onClick={() => addingLike(blog.id)}>
						like
					</button>
				</p>
				<p>added by {blog.user.name}</p>
				<p style={{ fontWeight: 'bold' }}>comments</p>
				<CommentForm
					blog={blog}
					setNotification={setNotification}
					clearNotification={clearNotification} />
				{blog.comments && (
					blog.comments.map((comment, index) => (
						<ul key={index} className="comment-container">
							<li className="comment-content">{comment.content}</li>
							<li className="comment-date">{formatDate(comment.date)}</li>
						</ul>
					))
				)}
			</div>

		</div>
	)
}

export default Blog