import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { addComment } from '../reducers/blogReducer'

const CommentForm = ({ blog, setNotification, clearNotification }) => {
	const dispatch = useDispatch()
	const [comment, setComment] = useState('')

	const addNewComment = async (event) => {
		try {
			event.preventDefault()
			//const blogObject = { ...blog, comments: comment }
			await dispatch(addComment({ id: blog.id, blog, comments: comment }))
			dispatch(setNotification({
				message: 'A new comment was added!', isError: false
			}
			))
			setTimeout(() => {
				dispatch(clearNotification())
			}, 5000)
		} catch (error) {
			console.log(error)
		}

	}
	return (
		<div>
			<form onSubmit={addNewComment} >

				<input
					type='text'
					value={comment}
					id='comment'

					onChange={(e) => setComment(e.target.value)}
					required
				/>
				<button type='submit'>save</button>
			</form>
		</div>
	)

}

export default CommentForm