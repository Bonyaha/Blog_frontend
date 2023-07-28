import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getUserById } from '../services/users'

const User = () => {
	const [showDetails, setShowDetails] = useState(false)
	const [user, setUser] = useState(null)
	const id = useParams().id // Get the ID parameter from the URL.
	console.log(id)


	useEffect(() => {
		// Fetch the user data based on the ID parameter.
		getUserById(id).then((userData) => {
			setUser(userData)
		})
	}, [id])

	console.log(user)

	const toggleDetails = () => {
		setShowDetails(!showDetails)
	}


	return (
		<div className='blogStyle'>
			{user ? (
				<p className='blog'>
					{user.username} {user.name}
					<button
						type='button'
						onClick={toggleDetails}
						style={{ marginLeft: '5px' }}
					>
						{showDetails ? 'hide' : 'view'}
					</button>
				</p>
			) : (
				<p>Loading...</p> // Show a loading message while waiting for the API response
			)}
			{showDetails && (
				<div>
					<p>Blogs:</p>
					<ul>
						{user.blogs.map((blog) => (
							<li key={blog.id}>
								{blog.title} - {blog.author}
								{/* <button type='button' onClick={() => handleDeletion()}>
									remove
								</button> */}
							</li>
						))}
					</ul>

					{/* {showModal && (
						<div className='modal-overlay'>
							<div className='modal'>
								<h2>Confirm Deletion</h2>
								<div className='button-container'>
									<button className='cancel-button' onClick={cancelDeletion}>
										Cancel
									</button>
									<button className='delete-button' onClick={delOneBlog}>
										Delete
									</button>
								</div>
							</div>
						</div>
					)} */}
				</div>
			)}
		</div>
	)
}

export default User
