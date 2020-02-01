const router = require('express').Router()

router.get('/', function(req, res, next) {
  res.json({ message: 'Server alive!' })
})

module.exports = router
