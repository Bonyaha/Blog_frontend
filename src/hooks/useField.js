import { useState } from 'react'

const useField = (type, required) => {
	const [value, setValue] = useState('')

	const onChange = (event) => {
		setValue(event.target.value)
	}

	return {
		type,
		required,
		value,
		onChange
	}
}

export default useField