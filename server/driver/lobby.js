const qs = require("qs");
const axios = require("axios");

const store = require("../store");
const { extractor } = require("../utilities");
const { URL, userAgent } = require("../constants");
const { updateState, resetState } = require("../actions");

class Lobby {
  static get driver() {
    return axios.create({ headers: { ...userAgent } });
  }

  static async authenticate(email, password) {
    try {
      let token,
        response,
        lobby = { session: "", cookie: "", age: null };
      // const driver = axios.create({ headers: { ...userAgent } });
      const driver = this.driver;

      response = await driver.get(URL.GET_MSID);
      updateState({
        type: "msid",
        value: extractor({ type: "msid", value: response.data })
      });

      response = await driver.post(
        URL.GENERATE_LOBBY_TOKEN(),
        qs.stringify({ email, password }),
        { headers: { "content-type": "application/x-www-form-urlencoded" } }
      );
      token = extractor({ type: "token", value: response.data });

      response = await driver.get(URL.GENERATE_LOBBY_SESSION(token), {
        maxRedirects: 0,
        validateStatus: status => status >= 200 && status < 303
      });
      updateState({ type: "account", value: { email, password } });

      // extract cookie
      response.headers["set-cookie"].forEach(cookieStr => {
        if (cookieStr.includes("gl5SessionKey") && !lobby.session) {
          lobby.session = cookieStr.split(";")[0].split(";")[0];
          lobby.age = extractor({ type: "session age", value: cookieStr });
        }
        lobby.cookie += cookieStr.split(";")[0] + "; ";
      });
      lobby.session = extractor({ type: "session", value: lobby.session });
      updateState({ type: "lobby", value: lobby });
      // authentication done
    } catch (err) {
      resetState({ type: "msid" });
      resetState({ type: "account" });
      resetState({ type: "lobby" });

      throw err;
    }
  }

  static async hitServer({ action, controller, params }) {
    const driver = this.driver;
    const {
      msid,
      lobby: { session, cookie: lobbyCookie }
    } = store.getState();

    if (!msid || !session || !lobbyCookie) {
      throw { name: "Forbidden", message: "There is no session" };
    }

    const cookie = lobbyCookie + msid;

    const { data } = await driver.post(
      URL.LOBBY_API,
      { action, controller, params, session },
      { headers: { cookie } }
    );

    return data;
  }
}

module.exports = Lobby;
