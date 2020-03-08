const {
  UPDATE_SESSION,
  UPDATE_COOKIE,
  UPDATE_AGE,
  UPDATE_STATE,
  RESET_SESSION,
  RESET_COOKIE,
  RESET_AGE,
  RESET_STATE,
} = require('../../actions/action-types')

const initState = {
  session: '',
  cookie: '',
  age: null,
}

module.exports = function(state = initState, action) {
  switch (action.type) {
    case UPDATE_SESSION:
      return {
        ...state,
        session: action.session,
      }

    case UPDATE_COOKIE:
      return {
        ...state,
        cookie: action.cookie,
      }

    case UPDATE_AGE:
      return {
        ...state,
        age: action.age,
      }

    case UPDATE_STATE:
      return {
        ...state,
        ...action.newState,
      }

    case RESET_SESSION:
      return {
        ...state,
        session: '',
      }

    case RESET_COOKIE:
      return {
        ...state,
        cookie: '',
      }

    case RESET_AGE:
      return {
        ...state,
        age: null,
      }

    case RESET_STATE:
      return {
        session: '',
        cookie: '',
        age: null,
      }

    default:
      return state
  }
}
