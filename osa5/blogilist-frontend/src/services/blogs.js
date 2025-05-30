import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const postBlog = (blog, user) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  }
  const request = axios.post(baseUrl, blog, config)
  return request.then(response => request)
}

export default { getAll, postBlog }