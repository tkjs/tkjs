const {
  UPDATE_SESSION,
  UPDATE_COOKIE,
  UPDATE_AGE,
  UPDATE_STATE,
  RESET_SESSION,
  RESET_COOKIE,
  RESET_AGE,
  RESET_STATE,
} = require('../actionTypes')
const store = require('../index')

module.exports = {
  updateSession: session => {
    store.dispatch({ name: 'lobby', type: UPDATE_SESSION, session })
  },
  updateCookie: cookie => {
    store.dispatch({ name: 'lobby', type: UPDATE_COOKIE, cookie })
  },
  updateAge: age => {
    store.dispatch({ name: 'lobby', type: UPDATE_AGE, age })
  },
  updateState: newState => {
    store.dispatch({ name: 'lobby', type: UPDATE_STATE, newState })
  },
  resetSession: () => {
    store.dispatch({ name: 'lobby', type: RESET_SESSION })
  },
  resetCookie: () => {
    store.dispatch({ name: 'lobby', type: RESET_COOKIE })
  },
  resetAge: () => {
    store.dispatch({ name: 'lobby', type: RESET_AGE })
  },
  resetState: () => {
    store.dispatch({ name: 'lobby', type: RESET_STATE })
  },
}
