const axios = require('axios')

const store = require('../store')
const urls = require('../constants/urls')
const userAgent = require('../constants/user-agent')

async function getOwnVillage() {
  const {
    msid,
    account: { worldName },
    lobby: { cookie: lobbyCookie },
    gameworld: { session: gameworldSession, cookie: gameworldCookie },
  } = store.getState()
  const url = urls.gameworldApi`worldName: ${worldName}`

  const { data } = await axios.post(
    `${url}/?c=cache&a=get&t${Date.now()}`,
    {
      action: 'get',
      controller: 'cache',
      params: { names: ['Collection:Village:own'] },
      session: gameworldSession,
    },
    {
      headers: {
        cookie: `${lobbyCookie}msid=${msid}; ${gameworldCookie}`,
        ...userAgent,
      },
    },
  )

  return data.cache[0].data.cache.map(village => village.data)
}

module.exports = { getOwnVillage }
