import apiClient from '../util/apiClient'
const baseUrl = '/api/users'

export const getAll = async () => {
	const response = await apiClient.get(baseUrl)
	return response.data
}


export const getUserById = async (userId) => {
	const response = await apiClient.get(`${baseUrl}/${userId}`)

	const userData = response.data

	return userData
}


export const addUser = async (newUser) => {
	const response = await apiClient.post(baseUrl, newUser)
	return response.data
}

