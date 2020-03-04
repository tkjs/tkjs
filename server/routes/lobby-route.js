const router = require('express').Router()

const { lobbyAuthentication, getMsid, getAvatarList } = require('../api/login')
const { encryptPassword } = require('../utilities/jwe-codec')
const actions = require('../store/actions')
const store = require('../store')

router.get('/', function(req, res, next) {
  const {
    lobby: { session, cookie, age },
  } = store.getState()

  res.json({
    lobbySession: session,
    lobbyCookie: cookie,
    lobbyAge: age,
  })
})

router.get('/avatar-list', async function(req, res, next) {
  try {
    const {
      lobby: { session, cookie },
    } = store.getState()

    if (!session || !cookie) {
      throw { name: 'Forbidden', message: 'there is no session' }
    }

    const avatarList = await getAvatarList(session, cookie)

    res.json({ avatarList })
  } catch (err) {
    next(err)
  }
})

router.post('/login', async function(req, res, next) {
  try {
    let { email, password } = req.body
    let msid = await getMsid()
    let lobby = await lobbyAuthentication({
      email,
      password,
      msid,
    })

    password = await encryptPassword(password)

    actions.msid.updateMsid(msid)
    actions.account.updateState({ email, password })
    actions.lobby.updateState(lobby)

    res.json({ message: `UpdateState:LoginToLobby 'success'` })
  } catch (err) {
    next(err)
  }
})

router.patch('/logout', function(req, res, next) {
  actions.msid.resetMsid()
  actions.account.resetState()
  actions.lobby.resetState()

  res.json({ message: `UpdateState:LogoutFromLobby 'success'` })
})

module.exports = router
