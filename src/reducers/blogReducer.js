const blogReducer = (state = [], action) => {
  const id = action.payload.id
  switch (action.type) {
    case 'SET_BLOGS':
      return action.payload
    case 'NEW_BLOG':
      return [...state, action.payload]
    case 'ADD_LIKE':

      return state.map((blog) => (blog.id !== id ? blog : action.payload))
    case 'DELETE_BLOG':
      return state.filter((blog) => blog.id !== action.payload)
    case 'CHECKED':
      return state.map((blog) => (blog.id !== id ? blog : action.payload))
    default:
      return state
  }
}

export default blogReducer