const axios = require('axios')

const store = require('../store')
const url = require('../constants/urls')
const userAgent = require('../constants/user-agent')
const { getAvatarList } = require('./lobby-section')
const {
  extractToken,
  extractSession,
  extractSessionAge,
} = require('./extractor')

async function gameworldAuthentication({ gameworldId, worldName }) {
  const { msid } = store.getState()

  if (!msid) throw { name: 'Forbidden', message: 'There is no msid' }

  const errors = []

  if (!gameworldId) errors.push('gameworld Id is required')
  if (!worldName) errors.push('gameworld name is required')

  if (errors.length > 0) {
    throw { name: 'BadRequest', message: errors }
  }

  let token,
    response,
    gameworld = { session: '', cookie: '', age: null }

  response = await axios.get(
    url.generateGameworldToken`gameworldId: ${gameworldId}, msid: ${msid}`,
    {
      headers: {
        ...userAgent,
      },
    },
  )
  token = extractToken(response.data)

  response = await axios.get(
    url.generateGameworldSession`worldName: ${worldName}, token: ${token}, msid: ${msid}`,
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
    if (cookieStr.includes('t5SessionKey')) {
      gameworld.session = cookieStr.split(';')[0]
      gameworld.age = extractSessionAge(cookieStr)
    }
    gameworld.cookie += cookieStr.split(';')[0] + '; '
  })
  gameworld.session = extractSession(gameworld.session)

  return gameworld
}

module.exports = { gameworldAuthentication }
