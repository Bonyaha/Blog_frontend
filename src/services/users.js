import axios from 'axios'
const baseUrl = '/api/users'

export const getAll = async () => {
	const response = await axios.get(baseUrl)
	return response.data
}


export const getUserById = async (userId) => {
	console.log('userId', userId)
	const response = await axios.get(`${baseUrl}/${userId}`)

	// Access the user data from the response.
	const userData = response.data
	console.log('userData', userData)

	// Return the user data.
	return userData
}


export const addUser = async (newUser) => {
	console.log(newUser)
	const response = await axios.post(baseUrl, newUser)
	return response.data
}


