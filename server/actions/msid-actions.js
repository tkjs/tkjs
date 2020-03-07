const { UPDATE_MSID, RESET_MSID } = require('./action-types')
const store = require('./store')

module.exports = {
  update: msid => store.dispatch({ type: UPDATE_MSID, msid }),
  reset: () => store.dispatch({ type: RESET_MSID }),
}
