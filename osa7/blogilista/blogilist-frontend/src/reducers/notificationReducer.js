import { createSlice } from "@reduxjs/toolkit";
let notificationTimer;

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    clearNotification(state, action) {
      return "";
    },
    addNotification(state, action) {
      return action.payload;
    },
  },
});

export const { clearNotification, addNotification } = notificationSlice.actions;

export const setNotification = (notification, seconds) => {
  return async (dispatch) => {
    const notificationAction = {
      type: "notification",
      payload: {
        content: notification.content,
        color: notification.color,
        seconds: 5,
      },
    };

    dispatch(addNotification(notificationAction.payload));
    if (notificationTimer) {
      clearTimeout(notificationTimer);
    }
    notificationTimer = setTimeout(() => {
      dispatch(clearNotification());
      notificationTimer = null;
    }, notificationAction.payload.seconds * 1000);
  };
};

export default notificationSlice.reducer;
