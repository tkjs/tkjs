const store = require("../store");
const Gameworld = require("../tkjs/driver/gameworld");
const actions = require("../tkjs/actions");

class GameworldController {
  static getState(request, response, next) {
    const {
      msid,
      account: { worldName },
      lobby: { session: lobbySession, cookie: lobbyCookie, age: lobbyAge },
      gameworld: {
        session: gameworldSession,
        cookie: gameworldCookie,
        age: gameworldAge
      }
    } = store.getState();

    if (
      msid &&
      worldName &&
      lobbySession &&
      lobbyCookie &&
      lobbyAge > new Date() &&
      gameworldSession &&
      gameworldCookie &&
      gameworldAge > new Date()
    ) {
      response.json({ status: "Logged In", type: "Gameworld" });
    } else {
      response.json({ status: "Logged Out", type: "Gameworld" });
    }
  }

  static async getOwnVillage(request, response, next) {
    try {
      const ownVillages = await Gameworld.getOwnVillage();
      response.json({ ownVillages });
    } catch (err) {
      next(err);
    }
  }

  static async authenticate(request, response, next) {
    try {
      const { gameworldId, worldName } = request.body;

      Gameworld.authenticate(gameworldId, worldName);

      response.json({ message: `UpdateState:LoginToGameworld 'success'` });
    } catch (err) {
      next(err);
    }
  }

  static resetState(request, response, next) {
    actions.gameworld.resetState();
    actions.account.resetWorldName();

    response.json({ message: `UpdateState:LogoutFromGameworld 'success'` });
  }
}

module.exports = GameworldController;
