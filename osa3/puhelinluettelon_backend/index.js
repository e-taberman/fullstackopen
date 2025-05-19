const express = require("express")
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(express.json())

morgan.token("body", (request) => {
    return JSON.stringify(request.body)
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": "1"
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": "2"
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": "3"
    },
    {
      "id": "9b00",
      "name": "Hattivatti",
      "number": "040 5005055050"
    },
    {
      "id": "7fc9",
      "name": "Dog",
      "number": "523542342"
    }
]


app.get("/", (request, response) => {
    response.send('<h1>Puhelinluettelo</h1><a href="/api/persons">View contacts</a>')
})

app.get("/api/persons", (request, response) => {
    response.send(persons)
})

app.get("/api/info", (request, response) => {
    const responseObj = `
    <div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    </div>`
    response.send(responseObj)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json( {
            error: "Name missing!"
        })
    }
    else if (!body.number) {
        return response.status(400).json( {
            error: "Number missing!"
        })
    }
    else if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: "Person is already in the phonebook!"
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: (Math.floor(Math.random() * 1000000)).toString()
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})