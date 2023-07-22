import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}
const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}
const delBLogs = async (blogsIds) => {
  const config = {
    headers: { Authorization: token },
    data: { ids: blogsIds },
  }
  await axios.delete(`${baseUrl}`, config)
}

const update = async ({ id, changedBlog }) => {
  console.log(id)
  console.log('receive updated object: ', changedBlog)
  const response = await axios.put(`${baseUrl}/${id}`, changedBlog)
  console.log('response after updating is ', response)
  return response.data
}

export default { getAll, create, delBLogs, update, setToken }
