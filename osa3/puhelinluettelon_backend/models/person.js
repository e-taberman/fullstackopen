const mongoose = require("mongoose")

require('dotenv').config()
const url = process.env.MONGODB_URI
console.log(url)

mongoose.set('strictQuery',false)

mongoose.connect(url)
  .then(result => {
    console.log("Connected to MongoDB")
  })
  .catch((error) => {
    console.log("Connection to MangoDB failed: ", error.message)
    process.exit(1)
  })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: String
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// const addPerson = (props) => {
//     console.log(props)
//   const person = new Person({
//     name: process.argv[3],
//     number: process.argv[4],
//     id: (Math.floor(Math.random() * 1000000000)).toString()
//   })

//   person.save().then(result => {
//     console.log(`Added ${process.argv[3]} number ${process.argv[4]} to the phonebook`)
//     mongoose.connection.close()
//   })
// }

const Person = mongoose.model("Person", personSchema)

module.exports = mongoose.model("Person", personSchema)