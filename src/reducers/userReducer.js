const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload
    case 'LOG_OUT':
      window.localStorage.clear()
      return null
    default:
      return state
  }
}

export default userReducer