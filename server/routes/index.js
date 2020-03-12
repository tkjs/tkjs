const router = require('express').Router()

const lobbyRouter = require('./lobby-route')
const gameworldRouter = require('./gameworld-route')

const { getOwnVillage } = require('../utilities')

const robberCleaner = require('../features/robber-cleaner')

router.get('/', function(req, res, next) {
  res.json({ message: 'Server alive!' })
})
router.use('/lobby', lobbyRouter)
router.use('/gameworlds', gameworldRouter)
router.get('/get-robber-list', robberCleaner)

module.exports = router
