import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    newBlog(state, action) {
      state.push(action.payload)
    },
    addLike(state, action) {
      console.log('action is ', action);
      const likeId = action.payload.id
      return state.map((blog) => (blog.id !== likeId ? blog : action.payload))
    },
    sortBlogs(state, action) {
      const { sortBy, sortOrder } = action.payload;
      console.log('sortBy is ', sortBy);
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
    },
    deleteBlog(state, action) {
      console.log('action.payload is ', action.payload);
      return state.filter((blog) => blog.id !== action.payload)
    },
    deleteBlogs(state, action) {
      return state.filter((blog) => !action.payload.includes(blog.id))
    },
    checked(state, action) {
      const checkedId = action.payload.id
      return state.map((blog) => (blog.id !== checkedId ? blog : action.payload))
    }
  }
})

export const { setBlogs, newBlog, addLike, sortBlogs, deleteBlog, deleteBlogs, checked } = blogSlice.actions

export const initializeBlogs = () => {
  //let initialBlogs = blogs
  return async dispatch => {

    const initialBlogs = await blogService.getAll()

    dispatch(setBlogs(initialBlogs))
  }
}

export const addNewBlog = (blogObject) => {
  return async (dispatch) => {
    const returnedBlog = await blogService.create(blogObject)
    dispatch(newBlog(returnedBlog))
    return returnedBlog
  }
}

export const addingLike = (id, blog) => {
  return async (dispatch) => {
    console.log('id is', id);
    console.log('blog is ', blog);
    const changedBlog = { ...blog, likes: blog.likes + 1 }
    console.log('changedBlog', changedBlog);
    const returnedBlog = await blogService.update(id, changedBlog)
    console.log('returnedBlog', returnedBlog);
    dispatch(addLike(returnedBlog))
  }
}

export const delOneBlog = (id) => {
  return async (dispatch) => {
    await blogService.delBLogs(id)
    dispatch(deleteBlog(id[0]))

  }
}

export const delBlogs = () => {
  return async (dispatch, getState) => {
    let blogs = getState().blogs
    console.log('blogs are ', blogs);
    let blogsToDelete = blogs.filter((b) => b.checked === true)
    const blogIds = blogsToDelete.map((b) => b.id)
    await blogService.delBLogs(blogIds)
    dispatch(deleteBlogs(blogIds))
    return Promise.resolve(blogIds.length); // we use Promise.resolve here in order to return promise and this line in App.js gets result - const result = await dispatch(delBlogs())
  }

}

export const handleCheck = (id, blog) => {
  return async (dispatch, getState) => {
    const changedBlog = { ...blog, checked: !blog.checked }
    const returnedBlog = await blogService.update(id, changedBlog)
    dispatch(checked(returnedBlog))
  }
}

export default blogSlice.reducer