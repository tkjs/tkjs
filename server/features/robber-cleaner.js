const axios = require('axios')

const store = require('../store')
const userAgent = require('../constants/user-agent')
const urls = require('../constants/urls')

const { getOwnVillage, reverseId, range, cellId } = require('../utilities')
const regionIds = require('../constants/region-ids')

async function robberCleaner(request, response, next) {
  let keys,
    capitalVillage,
    regions,
    coord,
    coords = [],
    robberHideoutList = []

  const ownVillages = await getOwnVillage()

  for (let village of ownVillages) {
    if (village.isMainVillage) {
      capitalVillage = village
      break
    }
  }

  keys = Object.keys(regionIds)

  for (let key of keys) {
    if (regionIds[key].includes(Number(capitalVillage.villageId))) {
      coord = reverseId(key)
      break
    }
  }

  for (let x of range(Number(coord[0]) - 1, Number(coord[0]) + 2)) {
    for (let y of range(Number(coord[1]) - 1, Number(coord[1]) + 2)) {
      coords.push(cellId(x, y))
    }
  }

  const {
    msid,
    account: { worldName },
    lobby: { cookie: lobbyCookie },
    gameworld: { session: gameworldSession, cookie: gameworldCookie },
  } = store.getState()
  const url = urls.gameworldApi`worldName: ${worldName}`

  const { data } = await axios.post(
    `${url}/?c=map&a=getByRegionIds&t${Date.now()}`,
    {
      action: 'getByRegionIds',
      controller: 'map',
      params: {
        regionIdCollection: {
          '1': coords,
        },
      },
      session: gameworldSession,
    },
  )

  regions = data.response[1].region

  Object.keys(regions).forEach(key => {
    regions[key].forEach(cell => {
      if (!cell.resType && !cell.oasis && cell.village) {
        robberHideoutList.push(cell)
      }
    })
  })

  response.json({ robberHideoutList })
}

module.exports = robberCleaner
