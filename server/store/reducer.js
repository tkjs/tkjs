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

const initState = {
  email: '',
  password: '',
  worldName: '',
  msid: '',
  lobbySession: '',
  lobbySessionAge: null,
  gameworldSession: '',
  gameworldSessionAge: null,
  cookies: '',
}

module.exports = function(state = initState, action) {
  switch (action.type) {
    case UPDATE_STATE:
      return {
        ...state,
        ...action.newState,
      }

    case UPDATE_EMAIL:
      return {
        ...state,
        email: action.email,
      }

    case UPDATE_PASSWORD:
      return {
        ...state,
        password: action.password,
      }

    case UPDATE_WORLD_NAME:
      return {
        ...state,
        worldName: action.worldName,
      }

    case UPDATE_MSID:
      return {
        ...state,
        msid: action.msid,
      }

    case UPDATE_LOBBY_SESSION:
      return {
        ...state,
        lobbySession: action.lobbySession,
      }

    case UPDATE_GAMEWORLD_SESSION:
      return {
        ...state,
        gameworldSession: action.gameworldSession,
      }

    case UPDATE_COOKIES:
      return {
        ...state,
        cookies: action.cookies,
      }

    case UPDATE_LOBBY_SESSION_AGE:
      return {
        ...state,
        lobbySessionAge: action.lobbySessionAge,
      }

    case UPDATE_GAMEWORLD_SESSION_AGE:
      return {
        ...state,
        gameworldSessionAge: action.gameworldSessionAge,
      }

    default:
      return state
  }
}
