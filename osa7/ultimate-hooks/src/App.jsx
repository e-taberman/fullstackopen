import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const onClear = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    onClear
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    try { fetchResources() }
    catch (error) { console.log(error) }
  }, [])

  const fetchResources = async () => {
    const res = await axios.get(baseUrl)
    setResources(res.data)
  }

  const create = async (resource) => {
    const res = await axios.post(baseUrl, resource)
    setResources(resources.concat(res.data))
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const { onClear: contentClear, ...contentInput } = content
  const { onClear: nameClear, ...nameInput } = name
  const { onClear: numberClear, ...numberInput } = number

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
    content.onClear()
  }

  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
    name.onClear()
    number.onClear()
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...contentInput} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...nameInput} /> <br/>
        number <input {...numberInput} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App