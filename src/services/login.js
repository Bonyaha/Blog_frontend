import apiClient from '../util/apiClient'
const baseUrl = '/api/login'

const login = async (credentials) => {
  const response = await apiClient.post(baseUrl, credentials)
  return response.data
}


export default { login }
