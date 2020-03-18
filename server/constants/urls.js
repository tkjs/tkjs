const store = require("../store");

class URL {
  static get LOBBY_URL() {
    return "https://lobby.kingdoms.com/api";
  }

  static get MELLON_URL() {
    return "https://mellon-t5-traviangames.com";
  }

  static get GAMEWORLD_URL() {
    const {
      account: { worldName }
    } = store.getState();

    return "https://" + worldName.toLowerCase() + ".kingdoms.com";
  }

  static get LOBBY_API() {
    return URL.LOBBY_URL + "/index.php";
  }

  static get GAMEWORLD_API() {
    return URL.GAMEWORLD_URL + "/api";
  }

  static get GET_MSID() {
    return URL.MELLON_URL + "/authentication/login";
  }

  static GENERATE_LOBBY_TOKEN() {
    const { msid } = store.getState();

    return (
      URL.MELLON_URL +
      `/authentication/login/ajax/form-validate?msid=${msid}&msname=msid`
    );
  }

  static GENERATE_LOBBY_SESSION(token) {
    const { msid } = store.getState();

    return URL.LOBBY_URL + `/login.php?token=${token}&msid=${msid}&msname=msid`;
  }

  static GENERATE_GAMEWORLD_TOKEN(gameworldId) {
    const { msid } = store.getState();

    return (
      URL.MELLON_URL +
      `/game-world/join/gameWorldId/${gameworldId}?msid=${msid}&msname=msid`
    );
  }

  static GENERATE_GAMEWORLD_SESSION(token) {
    const { msid } = store.getState();

    return (
      URL.GAMEWORLD_URL +
      `/api/login.php?token=${token}&msid=${msid}&msname=msid`
    );
  }
}

module.exports = URL;
