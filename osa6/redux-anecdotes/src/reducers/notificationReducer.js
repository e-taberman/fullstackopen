import { createSlice } from '@reduxjs/toolkit'
let notificationTimer

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    clearNotification(state, action) {
      return ''
    },
    addNotification(state, action) {
      return action.payload
    }
  }
})

export const { clearNotification, addNotification } = notificationSlice.actions

export const setNotification = (message, seconds) => {
  return async dispatch => {
    dispatch(addNotification(message))
    if (notificationTimer) {
      clearTimeout(notificationTimer)
    }
    notificationTimer = setTimeout(() => {
      dispatch(clearNotification())
      notificationTimer = null
    }, seconds * 1000)
  }
}



export default notificationSlice.reducer