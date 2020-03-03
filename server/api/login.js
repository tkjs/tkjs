const qs = require('querystring')

const ai = require('./axios-instance')
const url = require('./urls')

function extractToken(source) {
  const token = /token=([\w]*)&msid/g.exec(source)
  if (!token) throw { name: 'BadRequest', message: 'Token not found' }
  return token[1]
}

function extractMsid(source) {
  const msid = /msid=([\w]*)&msname/g.exec(source)
  if (!msid) throw { name: 'BadRequest', message: 'msid not found' }
  return msid[1]
}

function extractSession(source) {
  const session = /%7B%22key%22%3A%22([\w]*)%22%2C%22/g.exec(source)
  if (!session) throw { name: 'BadRequest', message: 'session not found' }
  return session[1]
}

function extractSessionAge(cookieString) {
  return new Date(cookieString.split(';')[1].split('=')[1])
}

async function getAvatarList(lobbySession, lobbyCookies) {
  const response = await ai.post(
    url.lobbyApi,
    {
      action: 'get',
      controller: 'cache',
      params: {
        names: ['Collection:Avatar'],
      },
      session: lobbySession,
    },
    {
      headers: {
        cookie: lobbyCookies,
      },
    },
  )

  return response.data.cache[0].data.cache
}

async function getMsid() {
  const response = await ai.get(url.getMsid)
  return extractMsid(response.data)
}

async function lobbyAuthentication({ email, password, msid }) {
  if (!email) throw { name: 'BadRequest', message: 'there is no email passed' }
  if (!password) {
    throw { name: 'BadRequest', message: 'there is no password passed' }
  }

  let token,
    response,
    lobby = {
      session: '',
      cookie: '',
      age: null,
    }

  response = await ai.post(
    url.generateToken`msid: ${msid}`,
    qs.stringify({ email, password }),
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    },
  )
  token = extractToken(response.data)

  response = await ai.get(
    url.generateLobbySession`token: ${token}, msid: ${msid}`,
    {
      maxRedirects: 0,
      validateStatus: status => status >= 200 && status < 303,
    },
  )

  // extract cookies
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

async function gameworldAuthentication({
  lobbySession,
  lobbyCookies,
  gameworldId,
  worldName,
  msid,
}) {
  // get gameworld id based on worldName
  let token,
    response,
    avatarList,
    gameworld = {
      session: '',
      cookie: '',
      age: null,
    }

  if (!gameworldId) {
    avatarList = await getAvatarList(lobbySession, lobbyCookies)

    gameworldId = avatarList.find(
      gameworld => gameworld.data.worldName === worldName.toUpperCase(),
    ).data.consumersId
  }

  // login to gameworld
  response = await ai.get(
    url.joinGameworld`gameworldId: ${gameworldId}, msid: ${msid}`,
  )
  token = extractToken(response.data)

  response = await ai.get(
    url.generateGameworldToken`worldName: ${worldName}, token: ${token}, msid: ${msid}`,
    {
      maxRedirects: 0,
      validateStatus: status => status >= 200 && status < 303,
    },
  )

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

module.exports = {
  lobbyAuthentication,
  gameworldAuthentication,
  getAvatarList,
  getMsid,
}
