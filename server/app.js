const customMorgan = require('./utilities/custom-morgan')
const express = require('express')
const app = express()

const port = process.env.PORT || 3000

app.use(customMorgan)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.get('/', function(req, res, next) {
  res.json({ message: 'Server Alive!' })
})

app.listen(port, () => console.log('listening on port', port))
