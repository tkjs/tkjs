function extractMsid(source) {
  const msid = /msid=([\w]*)&msname/g.exec(source)
  if (!msid) throw { name: 'BadRequest', message: 'msid not found' }
  return msid[1]
}

function extractToken(source) {
  const token = /token=([\w]*)&msid/g.exec(source)
  if (!token) throw { name: 'BadRequest', message: 'Token not found' }
  return token[1]
}

function extractSession(source) {
  const session = /%7B%22key%22%3A%22([\w]*)%22%2C%22/g.exec(source)
  if (!session) throw { name: 'BadRequest', message: 'session not found' }
  return session[1]
}

function extractSessionAge(cookieString) {
  return new Date(cookieString.split(';')[1].split('=')[1])
}

module.exports = {
  extractMsid,
  extractToken,
  extractSession,
  extractSessionAge,
}
