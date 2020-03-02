const {
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  UPDATE_WORLD_NAME,
  UPDATE_ACCOUNT_STATE,
  RESET_EMAIL,
  RESET_PASSWORD,
  RESET_WORLD_NAME,
  RESET_ACCOUNT_STATE,
} = require('../actionTypes')

const initState = {
  email: '',
  password: '',
  worldName: '',
}

module.exports = function(state = initState, action) {
  switch (action.type) {
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

    case UPDATE_ACCOUNT_STATE:
      return {
        ...state,
        ...action.newState,
      }

    case RESET_EMAIL:
      return {
        ...state,
        email: '',
      }

    case RESET_PASSWORD:
      return {
        ...state,
        password: '',
      }

    case RESET_WORLD_NAME:
      return {
        ...state,
        worldName: '',
      }

    case RESET_ACCOUNT_STATE: {
      return {
        email: '',
        password: '',
        worldName: '',
      }
    }

    default:
      return state
  }
}
