const {
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  UPDATE_WORLD_NAME,
  UPDATE_ACCOUNT_STATE,
  RESET_EMAIL,
  RESET_PASSWORD,
  RESET_WORLD_NAME,
  RESET_ACCOUNT_STATE,
} = require('./action-types')
const store = require('../store')

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
  updateState: newState => {
    store.dispatch({ type: UPDATE_ACCOUNT_STATE, newState })
  },
  resetEmail: () => {
    store.dispatch({ type: RESET_EMAIL })
  },
  resetPassword: () => {
    store.dispatch({ type: RESET_PASSWORD })
  },
  resetWorldName: () => {
    store.dispatch({ type: RESET_WORLD_NAME })
  },
  resetState: () => {
    store.dispatch({ type: RESET_ACCOUNT_STATE })
  },
}
