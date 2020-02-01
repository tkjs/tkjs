const morgan = require('morgan')
const moment = require('moment')

morgan.token('custom-date', function() {
  return moment().format('DD/MMM/YYYY HH:mm:ss')
})

const customLog = [
  ':remote-addr',
  '":method :url :status"',
  '- :response-time',
  '[:custom-date]',
].join(' ')

module.exports = morgan(customLog)
