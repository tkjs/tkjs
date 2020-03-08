const store = require('../store')
const actions = require('../actions')
const {
  getMsid,
  getAvatarList,
  encryptPassword,
  lobbyAuthentication,
} = require('../utilities')

class LobbyController {
  static getState(request, response, next) {
    const {
      lobby: { session, cookie, age },
    } = store.getState()

    if (session && cookie && age > new Date()) {
      response.json({ status: 'Logged In', type: 'Lobby' })
    } else {
      response.json({ status: 'Logged Out', type: 'Lobby' })
    }
  }

  static async getAvatar(request, response, next) {
    try {
      const avatarList = await getAvatarList()
      response.json({ avatarList })
    } catch (err) {
      next(err)
    }
  }

  static async authenticate(request, response, next) {
    try {
      let { email, password } = request.body
      let msid = await getMsid()
      let lobby = await lobbyAuthentication({ email, password, msid })

      password = await encryptPassword(password)

      actions.msid.update(msid)
      actions.account.updateState({ email, password })
      actions.lobby.updateState({ ...lobby })

      response.json({ message: `UpdateState:LoginToLobby 'success'` })
    } catch (err) {
      next(err)
    }
  }

  static resetState(request, response, next) {
    actions.msid.reset()
    actions.account.resetState()
    actions.lobby.resetState()
    response.json({ message: `UpdateState:LogoutFromLobby 'success'` })
  }
}

module.exports = LobbyController
