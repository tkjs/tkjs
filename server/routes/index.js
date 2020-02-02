const router = require('express').Router()
const state = require('../state')

router.get('/', function(req, res, next) {
  res.json({ message: 'Server alive!' })
})
router.get('/session', function(req, res, next) {
  if (!state.isLogin)
    throw { name: 'NotLogin', message: 'You are not logged in' }
  res.json({ token: state.token })
})

module.exports = router
