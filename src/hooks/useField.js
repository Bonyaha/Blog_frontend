import { useState } from 'react'

const useField = (type, required) => {
	const [value, setValue] = useState('')

	const onChange = (event) => {
		setValue(event.target.value)
	}

	const reset = () => {
		setValue('')
	}
	return {
		type,
		required,
		value,
		onChange,
		reset
	}
}

export default useField