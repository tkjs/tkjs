const { combineReducers } = require('redux')

const msid = require('./msid-reducer')
const account = require('./account-reducer')
const sessionBaseState = require('./session-base-state')

function createNamedWrapperReducer(reducerFunction, reducerName) {
  return (state, action) => {
    const { name } = action
    const isInitializationCall = state === undefined
    if (name !== reducerName && !isInitializationCall) return state
    return reducerFunction(state, action)
  }
}

module.exports = combineReducers({
  msid,
  account,
  lobby: createNamedWrapperReducer(sessionBaseState, 'lobby'),
  gameworld: createNamedWrapperReducer(sessionBaseState, 'gameworld'),
})
