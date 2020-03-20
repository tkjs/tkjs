const { InternalError } = require("../errors");

const gameworld = require("./gameworld-actions");
const account = require("./account-actions");
const lobby = require("./lobby-actions");
const msid = require("./msid-actions");

function updateState({ type, value }) {
  switch (type) {
    case "gameworld":
      gameworld.updateState(value);
      break;

    case "account":
      account.updateState(value);
      break;

    case "lobby":
      lobby.updateState(value);
      break;

    case "msid":
      msid.update(value);
      break;

    default:
      throw new InternalError(`Unhandle update state type: ${type}`);
  }
}

function resetState({ type }) {
  switch (type) {
    case "gameworld":
      gameworld.resetState();
      break;

    case "account":
      account.resetState();
      break;

    case "lobby":
      lobby.resetState();
      break;

    case "msid":
      msid.reset();
      break;

    default:
      throw new InternalError(`Unhandle reset state type: ${type}`);
  }
}

module.exports = {
  updateState,
  resetState,
  gameworld,
  account,
  lobby,
  msid
};
