/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')
require('dotenv').config()
// mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
// console.log("Connecting to ", url)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least three letters long'],
    },


    number: {
        type: String,
        validate: {
            validator: function (num) {
                return /\d{2,3}-\d{6,}/.test(num)
            },
            message: props => 'Number must be minimum 8 digits long.'
        },
        required: [true, 'Phone number is required'],
        // minlength: [8, "Number must be at least eight digits long"],
    }
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Person', personSchema)
