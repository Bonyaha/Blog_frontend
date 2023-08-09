import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: null,
  isError: false,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialState,
  reducers: {
    setNotification: (state, action) => {
      console.log(action)
      state.message = action.payload.message
      state.isError = action.payload.isError
    },
    clearNotification: () => initialState,
  },
})

export const { setNotification, clearNotification } = notificationSlice.actions

export default notificationSlice.reducer