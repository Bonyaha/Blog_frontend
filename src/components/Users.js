import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAll, addUser, delUser } from '../services/users'
import Togglable from './Togglable'
import UserForm from './UserForm'

const Users = ({ setSuccessMessage, setErrorMessage, blogFormRef, loggedUser, setUser }) => {
	const [users, setUsers] = useState([])
	const [showModal, setShowModal] = useState(false)

	const navigate = useNavigate()

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

	const deleteUser = async (id) => {
		const user = users.find((b) => b.id === id)
		try {
			await delUser(id)
			await getAll().then((users) => setUsers(users))
			navigate('/users')
			setSuccessMessage(`Deleted  user:${user.name}`)
			setTimeout(() => {
				setSuccessMessage(null)
			}, 5000)
		} catch (error) {
			if (error.response && error.response.data.error === 'token expired') {
				setErrorMessage('Session expired. Please log in again.')
				setTimeout(() => {
					setErrorMessage(null)
				}, 5000)
				setUser(null)
				window.localStorage.removeItem('loggedBlogappUser')
				return
			}

		}
	}


	const handleDeletion = () => {
		setShowModal(true)
	}
	const cancelDeletion = () => {
		setShowModal(false)
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
						{user.name !== loggedUser.name && (
							<>
								<button type='button' onClick={() => handleDeletion()}>
									remove
								</button>
								{showModal && (
									<div className='modal-overlay'>
										<div className='modal'>
											<h2>Confirm Deletion</h2>
											<div className='button-container'>
												<button className='cancel-button' onClick={cancelDeletion}>
													Cancel
												</button>
												<button className='delete-button' onClick={() => deleteUser(user.id)}>
													Delete
												</button>
											</div>
										</div>
									</div>
								)}
							</>
						)}
					</li>
				))}
			</ul>

		</div>
	)
}

export default Users