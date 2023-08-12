import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addLike, delOneBlog, initializeBlogs } from '../reducers/blogReducer'

const Blog = ({ blog, user, setNotification, clearNotification }) => {
	const [showModal, setShowModal] = useState(false)

	const dispatch = useDispatch()
	const blogs = useSelector(state => state.blogs)

	console.log(blog)
	const navigate = useNavigate()


	const handleDeletion = () => {
		setShowModal(true)
	}
	const cancelDeletion = () => {
		setShowModal(false)
	}

	const delBlog = async (id) => {
		//const blog = blogs.find((b) => b.id === id)
		try {
			await dispatch(delOneBlog([id]))
			navigate('/blogs')
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

	if (!blog) {
		return null
	}

	return (
		<div className='blogStyle'>
			<h2>
				{blog.title} {blog.author}
			</h2>

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
				{user.name === blog.user.name && (
					<button type='button' onClick={() => handleDeletion()} >
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
								<button className='delete-button' onClick={() => delBlog(blog.id)}>
									Delete
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

		</div>
	)
}

export default Blog