import apiClient from '../util/apiClient'
const baseUrl = '/api/users'

export const getAll = async () => {
	const response = await apiClient.get(baseUrl)
	console.log(response)
	return response.data
}


export const getUserById = async (userId) => {
	console.log('userId', userId)
	const response = await apiClient.get(`${baseUrl}/${userId}`)

	const userData = response.data
	console.log('userData', userData)

	return userData
}


export const addUser = async (newUser) => {
	console.log(newUser)
	const response = await apiClient.post(baseUrl, newUser)
	return response.data
}

