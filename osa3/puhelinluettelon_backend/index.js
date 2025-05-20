const express = require("express")
const app = express()
const Person = require('./models/person')
require('dotenv').config()
var morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))


morgan.token("body", (request) => {
    return JSON.stringify(request.body)
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

let persons = []

app.get("/", (request, response) => {
    response.send('<h1>Puhelinluettelo</h1><a href="/api/persons">View contacts</a>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
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
    Person.findById(id).then(person => {
        if (person) {
            console.log(person)
            response.json(person)
        }
        else {
            response.status(404).end()
        }
    })
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    Person.findByIdAndDelete(id)
        .then(result => {
            if (result) {
                response.status(204).end()
            }
            else {
                response.status(404).json({ error: "Person not found" })
            }
        })
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

    const person = new Person({
        name: body.name,
        number: body.number,
        id: (Math.floor(Math.random() * 1000000)).toString()
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})