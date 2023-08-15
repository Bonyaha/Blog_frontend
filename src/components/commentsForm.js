import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { addComment } from '../reducers/blogReducer'

const CommentForm = ({ blog, setNotification, clearNotification }) => {
	const dispatch = useDispatch()
	const [comment, setComment] = useState('')

	const addNewComment = async (event) => {
		try {
			event.preventDefault()
			const newComment = {
				content: comment,
			}
			await dispatch(addComment({ id: blog.id, blog, comments: newComment }))
			setComment('')
			dispatch(setNotification({
				message: 'A new comment was added!', isError: false
			}
			))
			setTimeout(() => {
				dispatch(clearNotification())
			}, 5000)
		} catch (error) {
			console.log(error)
			dispatch(setNotification({
				message: 'An error occurred', isError: true
			}))
			setTimeout(() => {
				dispatch(clearNotification())
			}, 5000)
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
				<button type='submit'>add comment</button>
			</form>
		</div>
	)

}

export default CommentForm