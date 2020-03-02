const { UPDATE_MSID, RESET_MSID } = require('../actionTypes')
const store = require('../index')

module.exports = {
  updateMsid: msid => store.dispatch({ type: UPDATE_MSID, msid }),
  resetMsid: () => store.dispatch({ type: RESET_MSID }),
}
