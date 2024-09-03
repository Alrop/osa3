/* eslint-disable no-unused-vars */
require('dotenv').config()
const Person = require('./models/person')

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()


app.use(express.json())
app.use(express.static('dist'))
app.use(cors())


morgan.token('post', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))




app.route('/api/info').get((req, res, next) => {
    Person.countDocuments({}).then((num) => {
        res.send(`Phonebook has info for ${num} people.<br>${Date().toString()}`)
    })
        .catch((error) => next(error))
})

app.route('/api/persons').get((req, res, next) => {
    // console.log(Person)
    Person.find({}).then(persons => {
        res.json(persons)
    })
        .catch((error) => next(error))

}).post((req, res, next) => {
    'use strict'
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Name or number is missing'
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then((saveRes) => {
        res.json(saveRes)
    })
        .catch((error) => next(error))
})


app.route('/api/persons/:id').get((req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
        .catch((error) => next(error))


}).put((req, res, next) => {
    // console.log(req, res)
    const body = req.body

    const person = ({
        name: body.name,
        number: body.number,
    })
    // console.log(req.params.name)

    Person.findByIdAndUpdate(req.params.id, person, {
        new: true,
        runValidators: true,
        context: 'query',
    })
        .then((updated) => {
            res.json(updated)
        })
        .catch((error) => res.status(500).json(error))

}).delete((req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch((error) => next(error))
})

const unknownEndpoint = (req, res) => {
    'use strict'
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log('At errorHandler')
    console.log(error)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'Malformat' })
    }

    if (error.name === 'ValidationError') {
        return res.status(400).send({ error: error.message })
    }
    res.status(500).json(error)
    next(error)
}

app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
