const router = require('express').Router()
const {
  lobbyAuthentication,
  gameworldAuthentication,
  getAvatarList,
} = require('../api/login')
const dispatch = require('../store/actions')
const store = require('../store')

const ai = require('../api/axios-instance')
const url = require('../api/urls')

router.get('/', function(req, res, next) {
  res.json({ message: 'Server alive!' })
})

router.post('/gameworlds', async function(req, res, next) {
  try {
    const [
      msid,
      lobbySession,
      lobbySessionAge,
      cookies,
    ] = await lobbyAuthentication({
      email: req.body.email,
      password: req.body.password,
    })

    dispatch.updateState({
      msid,
      lobbySession,
      lobbySessionAge,
      cookies,
    })

    const avatarList = await getAvatarList(lobbySession, cookies)

    res.json({ avatarList })
  } catch (err) {
    next(err)
  }
})

router.post('/login-gameworld', async function(req, res, next) {
  try {
    let { msid, lobbySession, cookies } = store.getState()
    let { worldName, gameworldId } = req.body

    const [
      gameworldSession,
      gameworldSessionAge,
      gameworldCookies,
    ] = await gameworldAuthentication({
      gameworldId: gameworldId,
      worldName: worldName,
      lobbySession,
      cookies,
      msid,
    })

    cookies += '; ' + gameworldCookies

    dispatch.updateState({
      cookies,
      worldName,
      gameworldSession,
      gameworldSessionAge,
    })

    const response = await ai.post(
      `${url.gameworldApi`worldName: ${worldName}`}/?c=cache&a=get&t=${Date.now()}`,
      {
        action: 'get',
        controller: 'cache',
        params: {
          names: ['Player'],
        },
        session: gameworldSession,
      },
      {
        headers: {
          cookie: cookies,
        },
      },
    )

    res.json(response.data)
  } catch (err) {
    next(err)
  }
})

module.exports = router
