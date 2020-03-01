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

async function getAvatarList(session, cookies) {
  const response = await ai.post(
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
        cookie: cookies,
      },
    },
  )

  return response.data.cache[0].data.cache
}

async function lobbyAuthentication({ email, password }) {
  if (!email) throw { name: 'BadRequest', message: 'there is no email passed' }
  if (!password) {
    throw { name: 'BadRequest', message: 'there is no password passed' }
  }

  let msid,
    token,
    response,
    lobbySessionAge,
    lobbySession = '',
    cookies = ''

  response = await ai.get(url.getMsid)
  msid = extractMsid(response.data)

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
    if (cookieStr.includes('gl5SessionKey') && !lobbySession) {
      lobbySession = cookieStr.split(';')[0].split(';')[0]
      lobbySessionAge = extractSessionAge(cookieStr)
    }

    cookies += cookieStr.split(';')[0] + '; '
  })

  cookies += cookies + `; msid=${msid}`
  lobbySession = extractSession(lobbySession)

  return [msid, lobbySession, lobbySessionAge, cookies]
}

async function gameworldAuthentication({
  lobbySession,
  gameworldId,
  worldName,
  cookies,
  msid,
}) {
  // get gameworld id based on worldName
  let token,
    response,
    avatarList,
    gameworldSession,
    gameworldSessionAge,
    gameworldCookies = ''

  if (!gameworldId) {
    avatarList = await getAvatarList(lobbySession, cookies)

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
      gameworldSession = cookieStr.split(';')[0]
      gameworldSessionAge = extractSessionAge(cookieStr)
    }

    gameworldCookies += cookieStr.split(';')[0] + '; '
  })

  gameworldSession = extractSession(gameworldSession)

  return [gameworldSession, gameworldSessionAge, gameworldCookies]
}

async function main(email, password, worldName) {
  const [
    msid,
    lobbySession,
    lobbySessionAge,
    lobbyCookies,
  ] = await lobbyAuthentication(email, password)

  const [
    gameworldSession,
    gameworldSessionAge,
    gameworldCookies,
  ] = await gameworldAuthentication(worldName, msid, lobbySession, lobbyCookies)

  const cookies = lobbyCookies + '; ' + gameworldCookies

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

  console.log(JSON.stringify(response.data, null, 2))
}

module.exports = {
  lobbyAuthentication,
  gameworldAuthentication,
  getAvatarList,
}
