const mongoose = require("mongoose")

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: String
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length < 3) {
  console.log('Password is needed.')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://esataberman:${password}@cluster0.kqsfuqm.mongodb.net/puhelinluettelo?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(result => {
    console.log("Connected to MongoDB")
  })
  .catch((error) => {
    console.log("Connection to MangoDB failed: ", error.message)
    process.exit(1)
  })

const showPeople = () => {
  Person.find({}).then(result => {
    console.log("Phonebook:")
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

const addPerson = () => {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    id: (Math.floor(Math.random() * 1000000000)).toString()
  })

  person.save().then(result => {
    console.log(`Added ${process.argv[3]} number ${process.argv[4]} to the phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  showPeople()
}
else if (process.argv.length === 5) {
  addPerson()
}
else {
  console.log("Invalid number of arguments.")
  process.exit()
}
