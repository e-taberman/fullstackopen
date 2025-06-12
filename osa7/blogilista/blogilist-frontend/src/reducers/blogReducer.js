import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload);
      return state;
    },
    clearBlogs(state, action) {
      return [];
    },
    deleteBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload.id);
    },
    updateBlog(state, action) {
      //
    },
    increaseLikes(state, action) {
      const likedBlog = state.find((blog) => blog.id === action.payload.id);
      likedBlog.likes += 1;
      return state;
    },
    addComment(state, action) {
      const likedBlog = state.find((blog) => blog.id === action.payload.id);
      likedBlog.comments.push(action.payload.comment);
    },
  },
});

export const {
  appendBlog,
  clearBlogs,
  deleteBlog,
  updateBlog,
  increaseLikes,
  addComment,
} = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    dispatch(clearBlogs());
    const blogs = await blogService.getAll();
    await blogs.forEach((blog) => {
      (blog.type = "blog"), dispatch(appendBlog(blog));
    });
  };
};

export default blogSlice.reducer;
