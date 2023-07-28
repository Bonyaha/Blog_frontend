import axios from 'axios'
const baseUrl = '/api/users'

export const getAll = async () => {
	const response = await axios.get(baseUrl)
	return response.data
}

export const getUserById = async (userId) => {
	try {
		console.log('userId', userId)
		const response = await axios.get(`${baseUrl}/${userId}`)

		// Access the user data from the response.
		const userData = response.data
		console.log('userData', userData)
		// Return the user data.
		return userData
	} catch (error) {
		// Handle any errors that occurred during the fetch process.
		console.error('Error fetching user data:', error)
		throw error // Rethrow the error to be handled by the caller.
	}
}

export const addUser = async (username, name, password,) => {
	try {
		const response = await axios.post(baseUrl, { username, name, password })

		return response.data
	} catch (error) {
		// Handle any request errors or server errors here
		return { error: 'Something went wrong' }
	}
}
