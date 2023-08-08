export const setNotification = (message, isError) => ({
  type: 'SET_NOTIFICATION',
  payload: { message, isError },
})

export const clearNotification = () => ({
  type: 'CLEAR_NOTIFICATION',
})
