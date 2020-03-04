const router = require('express').Router()

const { gameworldAuthentication } = require('../api/login')
const actions = require('../store/actions')
const store = require('../store')

router.get('/', function(req, res, next) {
  const {
    gameworld: { session, cookie, age },
  } = store.getState()

  res.json({
    gameworldSession: session,
    gameworldCookie: cookie,
    gameworldAge: age,
  })
})

router.post('/login', async function(req, res, next) {
  try {
    const {
      msid,
      lobby: { session, cookie },
    } = store.getState()

    if (!session || !cookie) {
      throw { name: 'Forbidden', message: 'there is no session' }
    }
    const { gameworldId, worldName } = req.body

    const gameworld = await gameworldAuthentication({
      lobbySession: session,
      lobbyCookie: cookie,
      gameworldId,
      worldName,
      msid,
    })

    actions.gameworld.updateState(gameworld)
    actions.account.updateWorldName(worldName)

    res.json({ message: `UpdateState:LoginToGameworld 'success'` })
  } catch (err) {
    next(err)
  }
})

router.post('/logout', function(req, res, next) {
  actions.gameworld.resetState()
  actions.account.resetWorldName()

  res.json({ message: `UpdateState:LogoutFromGameworld 'success'` })
})

module.exports = router
