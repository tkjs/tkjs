module.exports = function(err, req, res, next) {
  console.log(err)
  switch (err.name) {
    case 'BadRequest':
      res.status(400).json({ errors: [err.message] })
      break

    default:
      res.status(500).json({ errors: [err] })
      break
  }
}
