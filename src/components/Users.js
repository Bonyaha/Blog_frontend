import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAll } from '../services/users'

const Users = () => {
	const [users, setUsers] = useState([])

	useEffect(() => {
		getAll().then((users) => setUsers(users))
	}, [])
	console.log(users)
	return (
		<div>
			<h2>Users</h2>
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