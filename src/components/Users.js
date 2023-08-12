import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAll } from '../services/users'
import { addUser } from '../services/users'
import Togglable from './Togglable'
import UserForm from './UserForm'

const Users = ({ setSuccessMessage, setErrorMessage, blogFormRef }) => {
	const [users, setUsers] = useState([])

	useEffect(() => {
		getAll().then((users) => setUsers(users))
	}, [])
	console.log(users)

	const addNewUser = async (userObject) => {
		try {
			blogFormRef.current.toggleVisibility()

			const returnedUser = await addUser(userObject)

			setUsers(users.concat(returnedUser))
			setSuccessMessage(
				`A new user ${returnedUser.name} added!`
			)
			setTimeout(() => {
				setSuccessMessage(null)
			}, 5000)
		} catch (error) {
			console.log(error)
			setErrorMessage(error.response.data.error)
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)
		}
	}
	return (
		<div>
			<h2>Users</h2>
			<Togglable buttonLabel='new user' ref={blogFormRef}>
				<UserForm addNewUser={addNewUser} />
			</Togglable>
			<ul>
				{users.map((user) => (

					<li key={user.id} >
						<Link to={`/users/${user.id}`}>{user.name}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Users