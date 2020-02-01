const customMorgan = require('./middlewares/custom-morgan')
const routes = require('./routes')
const express = require('express')
const app = express()

app.use(customMorgan)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', routes)

module.exports = app
