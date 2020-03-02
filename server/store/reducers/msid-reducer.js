const { UPDATE_MSID, RESET_MSID } = require('../actionTypes')
const initState = ''

module.exports = function(state = initState, action) {
  switch (action.type) {
    case UPDATE_MSID:
      return action.msid

    case RESET_MSID:
      return ''

    default:
      return state
  }
}
