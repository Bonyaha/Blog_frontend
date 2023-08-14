import axios from 'axios'
const baseUrl = '/api/users'

export const getAll = async () => {
	const response = await axios.get(baseUrl)
	console.log(response)
	return response.data
}


export const getUserById = async (userId) => {
	console.log('userId', userId)
	const response = await axios.get(`${baseUrl}/${userId}`)

	const userData = response.data
	console.log('userData', userData)

	return userData
}


export const addUser = async (newUser) => {
	console.log(newUser)
	const response = await axios.post(baseUrl, newUser)
	return response.data
}

