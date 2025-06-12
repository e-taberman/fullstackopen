import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/user";

const userListSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    addUser(state, action) {
      state.push(action.payload);
    },
    clearUsers(state, action) {
      return [];
    },
  },
});

export const { addUser, clearUsers } = userListSlice.actions;

export const initializeUsers = () => {
  return async (dispatch) => {
    dispatch(clearUsers());
    const users = await userService.getAll();
    await users.forEach((user) => {
      (user.type = "user"), dispatch(addUser(user));
    });
  };
};

export default userListSlice.reducer;
