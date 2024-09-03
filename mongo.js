const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = import.meta.env.MONGO_DB


mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
})

switch (process.argv.length) {
    case 5:
        return (console.log(`Added ${person.name} number ${person.number} to phonebook`),
            mongoose.connection.close())
    case 3:
        return (Person.find({}).then(pers => {
            console.log(pers);
            mongoose.connection.close()
        }))
}

// person.save().then(result => {
//     console.log(`${person} added to database`)
//     mongoose.connection.close()
// })

// Person.find({}).then(result => {
//     result.forEach(person => {
//         console.log(person)
//     })
//     mongoose.connection.close()
// })