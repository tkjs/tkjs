const fs = require('fs')

module.exports = function(path, data) {
  fs.writeFile(path, JSON.stringify(data, null, 2), function(err) {
    if (err) throw err
    console.log(`Write data to ${path} done.`)
  })
}
