import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import blogService from '../services/blogs'


export const initializeBlogs = createAsyncThunk(
  'blogs/initializeBlogs',
  async () => {
    try {
      const initialBlogs = await blogService.getAll()
      return initialBlogs
    } catch (error) {
      throw new Error(error.message)
    }
  }
)

export const addNewBlog = createAsyncThunk(
  'blogs/addNewBlog',
  async (blogObject) => {
    try {
      const response = await blogService.create(blogObject)
      return response
    } catch (error) {
      if (error.response) {
        // If the error has a response from the server
        const serverResponse = error.response.data
        throw new Error(serverResponse.error) // Throw the server response as the error payload
      } else {
        // If it's a generic error without a response
        throw new Error(error.message) // Throw a generic error message as the error payload
      }
    }

  }
)

export const addLike = createAsyncThunk(
  'blogs/addLike',
  async ({ id, blog }) => {
    const changedBlog = { ...blog, likes: blog.likes + 1 }
    const returnedBlog = await blogService.update(id, changedBlog)
    return returnedBlog
  }
)
export const delOneBlog = createAsyncThunk(
  'blogs/delOneBlog',
  async (id) => {

    await blogService.delBLogs(id)
    return id[0]
  }
)

export const deleteMany = createAsyncThunk(
  'blogs/deleteMany',
  async (blogs) => {
    let blogsToDelete = blogs.filter((b) => b.checked === true)
    const blogIds = blogsToDelete.map((b) => b.id)
    await blogService.delBLogs(blogIds)
    return blogIds // we use Promise.resolve here in order to return promise and this line in App.js gets result
  }
)

export const handleCheck = createAsyncThunk(
  'blogs/handleCheck',
  async ({ id, blog }) => {
    const changedBlog = { ...blog, checked: !blog.checked }
    const returnedBlog = await blogService.update(id, changedBlog)

    return returnedBlog
  }
)

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    sortBlogs(state, action) {
      const { sortBy, sortOrder } = action.payload

      const sorted = [...state].sort((a, b) => {
        const sortValueA = a[sortBy]
        const sortValueB = b[sortBy]
        if (sortOrder === 'desc') {
          return sortValueB - sortValueA
        } else {
          return sortValueA - sortValueB
        }
      })
      return sorted
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeBlogs.fulfilled, (state, action) => {
        return action.payload
      })
      .addCase(addNewBlog.fulfilled, (state, action) => {
        state.push(action.payload)
      })
      .addCase(addNewBlog.rejected, (state, action) => {
        throw new Error(action.error.message)
      })
      .addCase(addLike.fulfilled, (state, action) => {
        const likeId = action.payload.id
        return state.map((blog) => (blog.id !== likeId ? blog : action.payload))
      })
      .addCase(addLike.rejected, (state, action) => {
        throw new Error(action.error.message)
      })
      .addCase(delOneBlog.fulfilled, (state, action) => {
        return state.filter((blog) => blog.id !== action.payload)
      })
      .addCase(delOneBlog.rejected, (state, action) => {
        throw new Error(action.error.message)
      })
      .addCase(deleteMany.fulfilled, (state, action) => {
        console.log(action)
        return state.filter((blog) => !action.payload.includes(blog.id))
      })
      .addCase(deleteMany.rejected, (state, action) => {
        throw new Error(action.error.message)
      })
      .addCase(handleCheck.fulfilled, (state, action) => {
        const checkedId = action.payload.id
        return state.map((blog) => (blog.id !== checkedId ? blog : action.payload))
      })
      .addCase(handleCheck.rejected, (state, action) => {
        throw new Error(action.error.message)
      })
  }
})

export const { sortBlogs } = blogSlice.actions
export default blogSlice.reducer