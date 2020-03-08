const store = require('../store')
const actions = require('../actions')

const { gameworldAuthentication } = require('../utilities')

class GameworldController {
  static getState(request, response, next) {
    const {
      gameworld: { session, cookie, age },
    } = store.getState()

    if (session && cookie && age > new Date()) {
      response.json({ status: 'Logged In', type: 'Gameworld' })
    } else {
      response.json({ status: 'Logged Out', type: 'Gameworld' })
    }
  }

  static async authenticate(request, response, next) {
    try {
      const { gameworldId, worldName } = request.body
      const gameworld = await gameworldAuthentication({
        gameworldId,
        worldName,
      })

      actions.gameworld.updateState(gameworld)
      actions.account.updateWorldName(worldName)

      response.json({ message: `UpdateState:LoginToGameworld 'success'` })
    } catch (err) {
      next(err)
    }
  }

  static resetState(request, response, next) {
    actions.gameworld.resetState()
    actions.account.resetWorldName()

    response.json({ message: `UpdateState:LogoutFromGameworld 'success'` })
  }
}

module.exports = GameworldController
