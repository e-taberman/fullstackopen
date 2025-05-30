const { transform } = require('lodash')
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    username: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        console.log(returnedObject)
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)
