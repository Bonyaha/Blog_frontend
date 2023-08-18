import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getUserById } from '../services/users'

const User = () => {
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

	return (
		<div >
			{user ? (
				<div>
					<h1 >
						{user.username}
					</h1>
					<p>added blogs:</p>
					<ol>
						{user.blogs.map((blog) => (
							<li key={blog.id}>
								{blog.title}
							</li>
						))}
					</ol>
				</div>
			) : (
				<p>Loading...</p> // Show a loading message while waiting for the API response
			)}

		</div>
	)
}

export default User