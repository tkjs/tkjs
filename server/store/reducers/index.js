const { combineReducers } = require('redux')

const account = require('./account-reducer')
const gameworld = require('./gameworld-reducer')
const lobby = require('./lobby-reducer')
const msid = require('./msid-reducer')

module.exports = combineReducers({
  account,
  gameworld,
  lobby,
  msid,
})
