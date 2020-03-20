const store = require("../tkjs/store");
const Lobby = require("../tkjs/driver/lobby");
const { resetState } = require("../tkjs/actions");

class LobbyController {
  static getState(request, response, next) {
    const {
      lobby: { session, cookie, age }
    } = store.getState();

    if (session && cookie && age > new Date()) {
      response.json({ status: "Logged In", type: "Lobby" });
    } else {
      response.json({ status: "Logged Out", type: "Lobby" });
    }
  }

  static async getAvatarList(request, response, next) {
    try {
      const avatarList = await Lobby.getAvatarList();
      response.json({ avatarList });
    } catch (err) {
      next(err);
    }
  }

  static async authenticate(request, response, next) {
    try {
      const { email, password } = request.body;

      await Lobby.authenticate(email, password);

      response.json({ message: `UpdateState:LoginToLobby 'success'` });
    } catch (err) {
      next(err);
    }
  }

  static resetState(request, response, next) {
    resetState({ type: "msid" });
    resetState({ type: "account" });
    resetState({ type: "lobby" });

    response.json({ message: `UpdateState:LogoutFromLobby 'success'` });
  }
}

module.exports = LobbyController;
