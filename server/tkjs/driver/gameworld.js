const axios = require("axios");

const URL = require("./url");
const store = require("../store");
const { extractor } = require("../utilities");
const { userAgent } = require("../constants");
const { BadRequestError } = require("../errors");
const { updateState, resetState, account } = require("../actions");

class Gameworld {
  static get driver() {
    return axios.create({ headers: { ...userAgent } });
  }

  static async authenticate(gameworldId, worldName) {
    try {
      if (!gameworldId) throw new BadRequestError("Gameworld Id is required");
      if (!worldName) throw new BadRequest("Worldname is required");

      let token,
        response,
        gameworld = { session: "", cookie: "", age: null };
      const driver = this.driver;

      updateState({ type: "account", value: { worldName } });

      response = await driver.get(URL.GENERATE_GAMEWORLD_TOKEN(gameworldId));
      token = extractor({ type: "token", value: response.data });

      response = await driver.get(URL.GENERATE_GAMEWORLD_SESSION(token), {
        maxRedirects: 0,
        validateStatus: status => status >= 200 && status < 303
      });

      // extract cookie
      response.headers["set-cookie"].forEach(cookieStr => {
        if (cookieStr.includes("t5SessionKey")) {
          gameworld.session = cookieStr.split(";")[0];
          gameworld.age = extractor({ type: "session age", value: cookieStr });
        }
        gameworld.cookie += cookieStr.split(";")[0] + "; ";
      });
      gameworld.session = extractor({
        type: "session",
        value: gameworld.session
      });

      updateState({ type: "gameworld", value: gameworld });
      // authentication done
    } catch (err) {
      account.resetWorldName();
      resetState({ type: "gameworld" });

      throw err;
    }
  }

  static async hitServer({ action, controller, params }) {
    const driver = this.driver;
    const {
      msid,
      lobby: { cookie: lobbyCookie },
      gameworld: { session: gameworldSession, cookie: gameworldCookie }
    } = store.getState();

    if (!msid || !lobbyCookie || !gameworldSession || !gameworldCookie) {
      throw new SessionFoundError();
    }

    const cookie = lobbyCookie + msid + "; " + gameworldCookie;

    const query = `/?c=${controller}&a=${action}&t${Date.now()}`;
    const url = URL.GAMEWORLD_API + query;

    const { data } = await driver.post(
      url,
      { action, controller, params, session: gameworldSession },
      { headers: { cookie } }
    );

    return data;
  }

  static async getCache(params) {
    const payload = {
      action: "get",
      controller: "cache",
      params
    };

    const data = await Gameworld.hitServer(payload);
    return data;
  }

  static async getOwnVillage() {
    const data = await this.getCache({ names: ["Collection:Village:own"] });
    return data.cache[0].data.cache.map(village => village.data);
  }
}

module.exports = Gameworld;
