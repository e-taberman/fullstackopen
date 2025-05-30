import axios from 'axios'
const baseUrl = '/api/login'

const login = (username, password) => {
    const loginInfo = {
        "username": username,
        "password": password
    }
    const request = axios.post(baseUrl, loginInfo)

    return request
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized: Invalid username or password')
            }
            throw error
        })
}

export default { login }