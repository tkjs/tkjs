const axios = require("axios");

const store = require("../store");
const userAgent = require("../constants/user-agent");
const urls = require("../constants/urls");

async function sendAttack({ target, villageId, units }) {
  const {
    msid,
    account: { worldName },
    lobby: { cookie: lobbyCookie },
    gameworld: { session: gameworldSession, cookie: gameworldCookie }
  } = store.getState();
  const url = urls.gameworldApi`worldName: ${worldName}`;

  const { data } = await axios.post(
    `${url}/?c=troops&a=send&t${Date.now()}`,
    {
      action: "send",
      controller: "troops",
      params: {
        destVillageId: Number(target),
        movementType: 3,
        redeployHero: false,
        spyMission: "resources",
        villageId: Number(villageId),
        units
      },
      session: gameworldSession
    },
    {
      headers: {
        ...userAgent,
        cookie: `${lobbyCookie}msid=${msid}; ${gameworldCookie}`
      }
    }
  );

  return data;
}

module.exports = sendAttack;
