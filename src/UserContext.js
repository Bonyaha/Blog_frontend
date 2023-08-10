import React, { createContext, useContext, useReducer } from 'react'

const UserContext = createContext()

const userReducer = (state, action) => {
	switch (action.type) {
		case 'SET_USER':
			return action.payload
		case 'LOGOUT':
			return null
		default:
			return state
	}
}

export const UserProvider = ({ children }) => {
	const [user, dispatchUser] = useReducer(userReducer, null)

	return (
		<UserContext.Provider value={[user, dispatchUser]}>
			{children}
		</UserContext.Provider>
	)
}

export const useUser = () => {
	return useContext(UserContext)
}
