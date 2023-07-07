const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_BLOGS':
      return action.payload
    case 'NEW_BLOG':
      return [...state, action.payload]
    case 'ADD_LIKE':
      const likeId = action.payload.id
      return state.map((blog) => (blog.id !== likeId ? blog : action.payload))
    case 'SORT_BLOGS':
      const { sortBy, sortOrder } = action.payload;
      const sorted = [...state].sort((a, b) => {
        const sortValueA = a[sortBy];
        const sortValueB = b[sortBy];
        if (sortOrder === 'desc') {
          return sortValueB - sortValueA;
        } else {
          return sortValueA - sortValueB;
        }
      });
      return sorted;
    case 'DELETE_BLOG':
      console.log('action.payload is ', action.payload);
      return state.filter((blog) => blog.id !== action.payload)
    case 'DELETE_BLOGS':
      return state.filter((blog) => !action.payload.includes(blog.id))
    case 'CHECKED':
      const checkedId = action.payload.id
      return state.map((blog) => (blog.id !== checkedId ? blog : action.payload))
    default:
      return state
  }
}

export default blogReducer