const qs = require('querystring')

const ai = require('./axios-instance')
const url = require('./urls')

const regexGetMsid = /msid=([\w]*)&msname/g
const regexGetToken = /token=([\w]*)&msid/g
const regexGetSession = /%7B%22key%22%3A%22([\w]*)%22%2C%22id%22%3A%2226386%22%7D/g

async function lobbyAuthentication(email, password) {
  if (!email) throw 'there is no email passed'
  if (!password) throw 'there is no password passed'

  let msid,
    token,
    response,
    lobbySession = '',
    cookies = ''

  response = await ai.get(url.getMsid)
  msid = regexGetMsid.exec(response.data)[1]

  response = await ai.post(
    url.generateToken`msid: ${msid}`,
    qs.stringify({ email, password }),
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    },
  )
  token = regexGetToken.exec(response.data)[1]

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
  lobbySession = regexGetSession.exec(lobbySession)[1]

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

async function gameworldAuthentication(gameworld, msid, lobbySession, cookies) {
  gameworld = gameworld.toLowerCase()

  //
}
