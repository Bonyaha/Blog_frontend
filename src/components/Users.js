import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { getAll } from '../services/users'
import { addUser } from '../services/users'
import Togglable from './Togglable'
import UserForm from './UserForm'

const useStyles = makeStyles({
	linkStyle: {
		textDecoration: 'none',
	},
	tableContainer: {
		marginTop: '10px',
	},
	tableHeaderCell: {
		fontWeight: 'bold',
		fontSize: '16px',
	},
})

const Users = ({ setSuccessMessage, setErrorMessage, blogFormRef }) => {
	const [users, setUsers] = useState([])

	const classes = useStyles()

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

			<TableContainer component={Paper} className={classes.tableContainer}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell className={classes.tableHeaderCell}>User</TableCell>
							<TableCell className={classes.tableHeaderCell}>Blogs created</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.id}>
								<TableCell>
									<Link className='linkStyle' to={`/users/${user.id}`}>{user.name}</Link>
								</TableCell>
								<TableCell>{user.blogs.length}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	)
}

export default Users