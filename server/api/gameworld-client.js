const axios = require("axios");
const url = require("../constants/urls");
const store = require("../store");

module.exports = function gameworldClient() {
  const {
    msid,
    account: { worldName },
    lobby: { cookie: lobbyCookie },
    gameworld: { session: gameworldSession, cookie: gameworldCookie }
  } = store.getState();

  const ai = axios.create({
    baseURL: `${url.gameworldApi`worldName: ${worldName}`}`,
    headers: {
      cookie: `${lobbyCookie}msid=${msid}; ${gameworldCookie}`,
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:73.0) Gecko/20100101 Firefox/73.0"
    }
  });

  return {
    playerGetAll: async () => {
      const {
        gameworld: { session: gameworldSession }
      } = store.getState();

      const { data } = await ai.post(`/?c=player&a=getAll&t${Date.now()}`, {
        action: "getAll",
        controller: "player",
        params: {
          deviceDimension: ""
        },
        session: gameworldSession
      });

      return data;
    }
  };
};
