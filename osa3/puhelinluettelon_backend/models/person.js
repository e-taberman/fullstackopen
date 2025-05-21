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
    name: {
      type: String,
      minlength: 3,
      required: true,
    },
    number: {
      type: String,
      minlength: 8,
      validate: {
        validator: function(num) {
          return /^\d{2,3}-\d*$/.test(num)
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    id: String
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model("Person", personSchema)

module.exports = mongoose.model("Person", personSchema)