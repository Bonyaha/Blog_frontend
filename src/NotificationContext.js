import React, { createContext, useContext, useReducer } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
	switch (action.type) {
		case 'SET_SUCCESS_MESSAGE':
			return { successMessage: action.payload, errorMessage: null }
		case 'SET_ERROR_MESSAGE':
			return { errorMessage: action.payload, successMessage: null }
		case 'CLEAR_MESSAGES':
			return { successMessage: null, errorMessage: null }
		default:
			return state
	}
}

export const NotificationProvider = ({ children }) => {
	const [notificationState, dispatchNotification] = useReducer(
		notificationReducer,
		{ successMessage: null, errorMessage: null }
	)

	return (
		<NotificationContext.Provider
			value={[notificationState, dispatchNotification]}
		>
			{children}
		</NotificationContext.Provider>
	)
}

export const useNotification = () => {
	return useContext(NotificationContext)
}
