const qs = require('querystring')
const axios = require('axios')

const store = require('../store')
const userAgent = require('../constants/user-agent')
const url = require('../constants/urls')
const {
  extractToken,
  extractSession,
  extractSessionAge,
} = require('./extractor')

async function getAvatarList() {
  const {
    msid,
    lobby: { session, cookie: lobbyCookie },
  } = store.getState()

  if (!session || !lobbyCookie) {
    throw { name: 'Forbidden', message: 'There is no session' }
  }

  const cookie = lobbyCookie + msid

  const { data } = await axios.post(
    url.lobbyApi,
    {
      action: 'get',
      controller: 'cache',
      params: {
        names: ['Collection:Avatar'],
      },
      session,
    },
    {
      headers: {
        ...userAget,
        cookie,
      },
    },
  )

  return data.cache[0].data.cache.map(avatar => avatar.data) // only need avatar data
}

async function lobbyAuthentication({ email, password, msid }) {
  const errors = []

  if (!email) errors.push('Email is required')
  if (!password) errors.push('Password is required')
  if (!msid) errors.push('msid is required')

  if (errors.length > 0) {
    throw { name: 'BadRequest', message: errors }
  }

  let token,
    response,
    lobby = { session: '', cookie: '', age: null }

  response = await axios.post(
    url.generateToken`msid: ${msid}`,
    qs.stringify({ email, password }),
    {
      headers: {
        ...userAgent,
        'content-type': 'application/x-www-form-urlencoded',
      },
    },
  )
  token = extractToken(response.data)

  response = await axios.get(
    url.generateLobbySession`token: ${token}, msid: ${msid}`,
    {
      maxRedirects: 0,
      validateStatus: status => status >= 200 && status < 303,
      headers: {
        ...userAgent,
      },
    },
  )

  // extract cookie
  response.headers['set-cookie'].forEach(cookieStr => {
    if (cookieStr.includes('gl5SessionKey') && !lobby.session) {
      lobby.session = cookieStr.split(';')[0].split(';')[0]
      lobby.age = extractSessionAge(cookieStr)
    }
    lobby.cookie += cookieStr.split(';')[0] + '; '
  })
  lobby.session = extractSession(lobby.session)

  return lobby
}

module.exports = { getAvatarList, lobbyAuthentication }
