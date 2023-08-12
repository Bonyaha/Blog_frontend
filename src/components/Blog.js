import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addLike, delOneBlog, initializeBlogs } from '../reducers/blogReducer'

const Blog = ({ blog, user, setNotification, clearNotification }) => {
	const [showDetails, setShowDetails] = useState(false)
	const [showModal, setShowModal] = useState(false)

	const dispatch = useDispatch()
	const blogs = useSelector(state => state.blogs)


	const navigate = useNavigate()

	const toggleDetails = () => {
		setShowDetails(!showDetails)
	}

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

export default Blog