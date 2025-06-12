import axios from "axios";
const baseUrl = "/api/blogs";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const postBlog = (blog, user) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const request = axios.post(baseUrl, blog, config);
  return request.then(() => request);
};

const updateBlog = (id, updateBlog, user) => {
  const config = {
    headers: { Authorization: `Bearer ${user.token}` },
  };
  const request = axios.put(`${baseUrl}/${id}`, updateBlog, config);
  return request.then(() => request);
};

const deleteBlog = (id, user) => {
  const config = {
    headers: { Authorization: `Bearer ${user.token}` },
  };
  return axios.delete(`${baseUrl}/${id}`, config);
};

const addComment = (id, user, comment) => {
  const config = {
    headers: { Authorization: `Bearer ${user.token}` },
  };
  return axios.post(
    `${baseUrl}/${id}/comments`,
    { comment: comment, id: id },
    config,
  );
};

export default {
  getAll,
  postBlog,
  updateBlog,
  deleteBlog,
  addComment,
};
