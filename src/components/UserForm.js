import { useState } from 'react'

const UserForm = ({ addNewUser }) => {
	const [newUser, setNewUser] = useState({ username: '', name: '', password: '' })

	const onSubmit = (event) => {
		event.preventDefault()

		addNewUser({ ...newUser })
		setNewUser({ username: '', name: '', password: '' })
	}
	const handleUserChange = (event, property) => {
		setNewUser((prevState) => ({
			...prevState,
			[property]: event.target.value,
		}))
	}
	return (
		<div>
			<h2>Create a new User</h2>

			<form onSubmit={onSubmit} className='blog-form'>
				<label htmlFor='username'>Username:</label>
				<input
					type='text'
					value={newUser.username}
					id='username'
					className='form-control'
					onChange={(event) => handleUserChange(event, 'username')}
					required
				/>

				<label htmlFor='name'>Name:</label>
				<input
					type='text'
					value={newUser.name}
					id='name'
					className='form-control'
					onChange={(event) => handleUserChange(event, 'name')}
					required
				/>

				<label htmlFor='password'>Password:</label>
				<input
					type='text'
					value={newUser.password}
					id='password'
					className='form-control'
					onChange={(event) => handleUserChange(event, 'password')}
					required
				/>

				<button type='submit'>save</button>
			</form>
		</div>
	)
}

export default UserForm