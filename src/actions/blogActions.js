/* import blogService from '../services/blogs'

export const initializeBlogs = (blogs = null) => {
  let initialBlogs = blogs
  return async dispatch => {
    if (!initialBlogs) {
      initialBlogs = await blogService.getAll()
    }
    dispatch({
      type: 'SET_BLOGS',
      payload: initialBlogs,
    })
  }
}

export const addNewBlog = (blogObject) => {
  return async (dispatch) => {

    const returnedBlog = await blogService.create(blogObject)
    dispatch({
      type: 'NEW_BLOG',
      payload: returnedBlog,
    })
    return returnedBlog
  }
}

export const addingLike = (id, blog) => {
  return async (dispatch, getState) => {
    const changedBlog = { ...blog, likes: ++blog.likes }
    const returnedBlog = await blogService.update(id, changedBlog)
    dispatch({
      type: 'ADD_LIKE',
      payload: returnedBlog,
    })
  }
}

export const handleCheck = (id, blog) => {
  return async (dispatch, getState) => {
    const changedBlog = { ...blog, checked: !blog.checked }
    const returnedBlog = await blogService.update(id, changedBlog)
    dispatch({
      type: 'CHECKED',
      payload: returnedBlog,
    })
  }
}

export const sortBlogs = (sortBy, sortOrder) => {
  return {
    type: 'SORT_BLOGS',
    payload: { sortBy, sortOrder },
  };
};


export const delOneBlog = (id) => {
  return async (dispatch) => {
    await blogService.delBLogs(id)
    dispatch({
      type: 'DELETE_BLOG',
      payload: id[0],
    })
  }
}

export const delBlogs = () => {
  return async (dispatch, getState) => {
    let blogs = getState().blogs
    console.log('blogs are ', blogs);
    let blogsToDelete = blogs.filter((b) => b.checked === true)
    const blogIds = blogsToDelete.map((b) => b.id)
    await blogService.delBLogs(blogIds)
    dispatch({
      type: 'DELETE_BLOGS',
      payload: blogIds,
    })
    return Promise.resolve(blogIds.length); // we use Promise.resolve here in order to return promise and this line in App.js gets result - const result = await dispatch(delBlogs())
  }

} */