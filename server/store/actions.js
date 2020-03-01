const {
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  UPDATE_WORLD_NAME,
  UPDATE_MSID,
  UPDATE_LOBBY_SESSION,
  UPDATE_LOBBY_SESSION_AGE,
  UPDATE_GAMEWORLD_SESSION,
  UPDATE_GAMEWORLD_SESSION_AGE,
  UPDATE_COOKIES,
  UPDATE_STATE,
} = require('./actionTypes')
const store = require('./index')

module.exports = {
  updateEmail: email => {
    store.dispatch({ type: UPDATE_EMAIL, email })
  },
  updatePassword: password => {
    store.dispatch({ type: UPDATE_PASSWORD, password })
  },
  updateWorldName: worldName => {
    store.dispatch({ type: UPDATE_WORLD_NAME, worldName })
  },
  updateMsid: msid => {
    store.dispatch({ type: UPDATE_MSID, msid })
  },
  updateLobbySession: lobbySession => {
    store.dispatch({ type: UPDATE_LOBBY_SESSION, lobbySession })
  },
  updateLobbySessionAge: lobbySessionAge => {
    store.dispatch({ type: UPDATE_LOBBY_SESSION_AGE, lobbySessionAge })
  },
  updateGameworldSession: gameworldSession => {
    store.dispatch({ type: UPDATE_GAMEWORLD_SESSION, gameworldSession })
  },
  updateGameworldSessionAge: gameworldSessionAge => {
    store.dispatch({ type: UPDATE_GAMEWORLD_SESSION_AGE, gameworldSessionAge })
  },
  updateCookies: cookies => {
    store.dispatch({ type: UPDATE_COOKIES, cookies })
  },
  updateState: newState => {
    store.dispatch({ type: UPDATE_STATE, newState })
  },
}
