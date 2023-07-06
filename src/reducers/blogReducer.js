const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_BLOGS':
      return action.payload
    case 'NEW_BLOG':
      return [...state, action.payload]
    case 'ADD_LIKE':
      const likeId = action.payload.id
      return state.map((blog) => (blog.id !== likeId ? blog : action.payload))
    case 'DELETE_BLOG':
      console.log('action.payload is ', action.payload);
      return state.filter((blog) => blog.id !== action.payload)
    case 'CHECKED':
      const checkedId = action.payload.id
      return state.map((blog) => (blog.id !== checkedId ? blog : action.payload))
    default:
      return state
  }
}

export default blogReducer