import blogService from '../services/blogs'

export const initializeBlogs = () => {
  return async dispatch => {
    const initialBlogs = await blogService.getAll()
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
    /* const blogs = getState().blogs
    const blog = blogs.find((n) => n.id === id) */
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

export const delOneBlog = (id) => {
  return async (dispatch) => {
    await blogService.delBLogs(id)
    dispatch({
      type: 'DELETE_BLOG',
      payload: id[0],
    })
  }
}