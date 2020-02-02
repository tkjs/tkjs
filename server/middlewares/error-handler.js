module.exports = function(err, req, res, next) {
  switch (err.name) {
    case 'NotLogin':
      res.status(403).json({ errors: [err.message] })
      break

    default:
      res.status(500).json({ errors: [err] })
  }
}
