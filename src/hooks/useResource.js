import { useState } from 'react'
import axios from 'axios'

const useResource = (token) => {
	const baseUrl = '/api/blogs'
	const [resources, setResources] = useState([])

	const getAll = () => {
		axios.get(baseUrl) // Use the token in the request header
			.then((response) => {
				setResources(response.data)
			})
			.catch((error) => {
				console.error('Error fetching resources:', error)
			})
	}

	const create = (newObject) => {
		axios.post(baseUrl, newObject, { headers: { Authorization: `Bearer ${token}` } })
			.then((response) => {
				setResources([...resources, response.data])
				return response.data
			})
			.catch((error) => {
				console.error('Error creating resource:', error)
				throw error

			})
	}

	const update = (id, newNote) => {
		return new Promise((resolve, reject) => {
			axios.put(baseUrl + `/${id}`, newNote)
				.then((response) => {
					if (response === null) {
						setResources(resources.filter((n) => n.id !== id))
					} else {
						setResources(resources.map((note) => (note.id !== id ? note : response.data)))
					}
					resolve(response.data)
				})
				.catch((error) => {
					setResources(resources.filter((n) => n.id !== id))
					reject(error)
				})
		})
	}
	const deleteBlog = async (blogsIds) => {
		const config = {
			headers: { Authorization: `Bearer ${token}` },
			data: { ids: blogsIds },
		}

		await axios.delete(`${baseUrl}`, config)
	}

	return [resources, { getAll, create, update, deleteBlog }]
}

export default useResource