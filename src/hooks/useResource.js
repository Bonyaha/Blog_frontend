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

	const create = async (newObject) => {
		const response = await axios.post(baseUrl, newObject, { headers: { Authorization: `Bearer ${token}` } })

		setResources([...resources, response.data])
		return response.data
	}

	const update = async (id, newBlog) => {
		try {
			const response = await axios.put(baseUrl + `/${id}`, newBlog)
			if (response === null) {
				setResources(resources.filter((b) => b.id !== id))
			} else {
				setResources(resources.map((blog) => (blog.id !== id ? blog : response.data)))
			}
		} catch (error) {
			setResources(resources.filter((n) => n.id !== id))
		}
	}

	const deleteBlog = async (blogsIds) => {
		const config = {
			headers: { Authorization: `Bearer ${token}` },
			data: { ids: blogsIds },
		}
		await axios.delete(`${baseUrl}`, config)
	}
	const sort = (sortBy, sortOrder) => {
		//we need to create a new array before sorting it, that's why we use spread on blogs
		const sorted = [...resources].sort((a, b) => {
			const sortValueA = a[sortBy]
			const sortValueB = b[sortBy]
			if (sortOrder === 'desc') {
				return sortValueB - sortValueA
			} else {
				return sortValueA - sortValueB
			}
		})
		console.log('sorted blogs are ', sorted)
		setResources(sorted)
	}


	return [resources, { getAll, create, update, deleteBlog, sort }]
}

export default useResource