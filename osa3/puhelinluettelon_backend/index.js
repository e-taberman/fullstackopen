const express = require('express')
const app = express()
const Person = require('./models/person')
require('dotenv').config()
var morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))


morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = []

// app.get("/", (request, response) => {
//     response.send('<h1>Puhelinluettelo</h1><a href="/api/persons">View contacts</a>')
// })

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/info', (request, response, next) => {
  Person.find({})
    .then(personsInDatabase => {
      const responseObj = `
            <div>
                <p>Phonebook has info for ${personsInDatabase.length} people</p>
                <p>${new Date()}</p>
            </div>`
      response.send(responseObj)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  Person.findByIdAndDelete(id)
    .then(result => {
      if (result) {
        response.status(204).end()
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body


  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name or number missing' })
  }

  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(400).json({ error: 'That person already exists' })
      }

      const person = new Person({
        name: body.name,
        number: body.number,
        id: (Math.floor(Math.random() * 1000000)).toString()
      })

      person.save()
        .then(savedPerson => {
          response.json(savedPerson)
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))

  return
})

app.put('/api/persons/:id', (request, response, next) => {
  const { number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).json({ error: 'Updated person not found' })
      }
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)