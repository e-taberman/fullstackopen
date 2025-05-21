import axios from 'axios'
// const serverUrl = "http://localhost:3001/api/persons/"
const serverUrl = "/api/persons/"

const getAll = () => {
    const request = axios.get(serverUrl)
    return request.then(response => response.data)
}

const create = (newPerson) => {
    const request = axios.post(serverUrl, newPerson)
    return request.then(response => {
        return response.data
    })
}

const remove = (personsList, id) => {
    return axios.delete(`${serverUrl}${id}`).then(() => {
        return getAll().then(() => {
            return personsList.filter(p => p.id !== id)
        })
    })
}

const updateNumber = (id, updatedPerson) => {
    const request = axios.put(`${serverUrl}${id}`, updatedPerson)
    return request.then(response => response.data)
}

export default { create, remove, getAll, updateNumber }