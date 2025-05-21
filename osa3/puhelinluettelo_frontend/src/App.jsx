import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from "./services/persons"

const Notification = (props) => {
  const notificationStyle = {
    color: props.color || "red",
    fontWeight: "bold",
    borderStyle: "solid",
    padding: "5px",
    marginBottom: "10px"
  }

  useEffect(() => {
    if (props.message) {
      const timer = setTimeout(() => {
        props.setErrorText("")
      }, 5000)
      return () => clearTimeout(timer);
    }
  })

  if (props.message !== "") return <div style={notificationStyle}>{props.message}</div>
  else return <div>{props.message}</div>
}

const Entry = (props) => {
  return (
    <div>
      {props.name} {props.number}
      <button onClick={() => props.handlePersonRemoval(props.id, props.name)}>delete</button>
    </div>
  )
}

const Filter = (props) => {
  return (
    <div>filter shown with: <input value={props.value} onChange={props.onChange} /></div>
  )
}

const Form = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        name: <input value={props.name} onChange={props.handleNameChange} />
      </div>
      <div>
        number: <input value={props.number} onChange={props.handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const PersonList = (props) => {
  return (
    <div>
      {props.persons.map((person) => (
        <Entry key={person.name} name={person.name} number={person.number} persons={props.persons} handlePersonRemoval={props.handlePersonRemoval} id={person.id}/>
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [showedPersons, setShowedPersons] = useState([...persons])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [newSearch, setNewSearch] = useState("")
  const [errorText, setErrorText] = useState("")
  const [errorColor, setErrorColor] = useState("red")

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    let search = event.target.value
    search = search.toLowerCase()
    setNewSearch(event.target.value)
    if (event.target.value.length === 0) {
      setShowedPersons([...persons])
    }
    else {
      const newShowedPersons = persons.filter(person =>
        person.name.toLowerCase().includes(search)
      )

      setShowedPersons(newShowedPersons)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (newName === null || newName === "") {
      setErrorText("Invalid name.")
      setErrorColor("red")
      return null
    }
    personService.getAll().then((allPersons) => {
      if (allPersons.some(person => person.name === newName)) {
        if (window.confirm(`${newName} is already added to the phonebook, replace old number with  a new one?`)) {
          const foundPerson = allPersons.find((p) => p.name === newName)
          const newPerson = { ...foundPerson, number: newNumber}
          setErrorColor("green")
          setErrorText(`The number of "${newName}" has been updated.`)
          setNewName("")
          setNewNumber("")

          personService.updateNumber(foundPerson.id, newPerson).then((updatedPerson) => {
            const updatedPersons = allPersons.map(person =>
              person.id === updatedPerson.id ? updatedPerson : person
            )
            setPersons(updatedPersons)
            setShowedPersons(updatedPersons)
          })
        }
        else return null
      }
      else {
        const newPerson = { name: newName, number: newNumber }

        personService.create(newPerson)
          .then((createdPerson) => {
            const updatedPersons = [...allPersons, createdPerson]
            setPersons(updatedPersons)

            const newShowedPersons = updatedPersons.filter(person =>
              person.name.toLowerCase().includes(newSearch)
            )
            setShowedPersons(newShowedPersons)

            setNewName("")
            setNewNumber("")
            setErrorColor("green")
            setErrorText(`"${newName}" was added to the phonebook.`)
          })
          .catch((error) => {
            setErrorColor("red")
            if (error.response && error.response.data && error.response.data.error) {
              setErrorText(error.response.data.error)
            } else {
              setErrorText("ERROR!")
            }
          })
      }
    })
  }

  const handlePersonRemoval = (id, name) => {
    personService.getAll().then((allPersons) => {
      const exists = allPersons.some(person => person.id === id);
      if (!exists) {
        setErrorColor("red")
        setErrorText(`"${name}" has already been removed from the phonebook.`)
        return
      }
      if (!window.confirm(`Delete ${name}?`)) {
        return null
      }
      setErrorColor("green")
      setErrorText(`"${name}" has been removed from the phonebook.`)
      personService.remove(persons, id).then(response => {
        setPersons(response)
        setShowedPersons(response)
      })
    })
  }

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response)
        setShowedPersons(response)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorText} setErrorText={setErrorText} color={errorColor} />
      <Filter value={newSearch} onChange={handleSearchChange} />
      <h2>Add a new</h2>
      <Form name={newName} number={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} onSubmit={handleSubmit} />
      <h2>Numbers</h2>
      <PersonList persons={showedPersons} handlePersonRemoval={handlePersonRemoval} />
    </div>
  )
}

export default App