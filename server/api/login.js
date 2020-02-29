const qs = require('querystring')

const ai = require('./axios-instance')
const url = require('./urls')

async function lobbyAuthentication(email, password) {
  if (!email) throw 'there is no email passed'
  if (!password) throw 'there is no password passed'

  let msid,
    token,
    response,
    lobbySession = '',
    cookies = ''

  response = await ai.get(url.getMsid)
  msid = /msid=([\w]*)&msname/g.exec(response.data)[1]

  response = await ai.post(
    url.generateToken`msid: ${msid}`,
    qs.stringify({ email, password }),
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    },
  )
  token = /token=([\w]*)&msid/g.exec(response.data)[1]

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
    }

    cookies += cookieStr.split(';')[0] + '; '
  })

  cookies += cookies + `; msid=${msid}`
  lobbySession = /%7B%22key%22%3A%22([\w]*)%22%2C%22/g.exec(lobbySession)[1]

  // example on sending request using cookies and session
  // response = await ai.post(
  // url.lobbyApi,
  // {
  // action: 'getAll',
  // controller: 'player',
  // params: {},
  // session: lobbySession,
  // },
  // {
  // headers: {
  // cookie: cookies,
  // },
  // },
  // )

  // console.log(JSON.stringify(response.data, null, 2))

  return [msid, lobbySession, cookies]
}

async function gameworldAuthentication(worldName, msid, lobbySession, cookies) {
  // get gameworld id based on worldName
  let response,
    gameworldId,
    token,
    gameworldSession,
    gameworldCookies = ''

  response = await ai.post(
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
        cookie: cookies,
      },
    },
  )

  gameworldId = response.data.cache[0].data.cache.find(
    gameworld => gameworld.data.worldName === worldName.toUpperCase(),
  ).data.consumersId

  // login to gameworld
  response = await ai.get(
    url.joinGameworld`gameworldId: ${gameworldId}, msid: ${msid}`,
  )
  token = /token=([\w]*)&msid/g.exec(response.data)[1]

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
    }

    gameworldCookies += cookieStr.split(';')[0] + '; '
  })

  gameworldSession = /%7B%22key%22%3A%22([\w]*)%22%2C%22/g.exec(
    gameworldSession,
  )[1]

  return [gameworldSession, gameworldCookies]
}

async function main(email, password, worldName) {
  const [msid, lobbySession, lobbyCookies] = await lobbyAuthentication(
    email,
    password,
  )

  const [gameworldSession, gameworldCookies] = await gameworldAuthentication(
    worldName,
    msid,
    lobbySession,
    lobbyCookies,
  )

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
