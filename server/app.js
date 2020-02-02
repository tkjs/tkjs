const customMorgan = require('./middlewares/custom-morgan')
const errorHandler = require('./middlewares/error-handler')
const express = require('express')
const routes = require('./routes')
const app = express()

app.use(customMorgan)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', routes)
app.use(errorHandler)

module.exports = app
