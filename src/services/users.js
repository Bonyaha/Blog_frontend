import axios from 'axios'
const baseUrl = '/api/users'

export const getAll = async () => {
	const response = await axios.get(baseUrl)
	return response.data
}

export const getUserById = async (userId) => {
	try {
		console.log('userId', userId)
		// Send a GET request to the backend API to fetch the user data.
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

