const logger = require('./middlewares/custom-morgan')
const errorHandler = require('./middlewares/error-handler')
const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(logger)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', routes)
app.use(errorHandler)

module.exports = app
