const axios = require("axios");

const store = require("../store");
const userAgent = require("../constants/user-agent");
const urls = require("../constants/urls");

const { getOwnVillage, reverseId, range, cellId } = require("../utilities");
const regionIds = require("../constants/region-ids");

const sendAttack = require("./send-attack");

async function robberCleaner(request, response, next) {
  // receive village id where the troops come from
  // receive units for clearing robber hideout

  let keys,
    detailAttack,
    capitalVillage,
    regions,
    coord,
    coords = [],
    robberHideoutList = [];

  const ownVillages = await getOwnVillage();

  for (let village of ownVillages) {
    if (village.isMainVillage) {
      capitalVillage = village;
      break;
    }
  }

  keys = Object.keys(regionIds);

  for (let key of keys) {
    if (regionIds[key].includes(Number(capitalVillage.villageId))) {
      coord = reverseId(key);
      break;
    }
  }

  for (let x of range(Number(coord[0]) - 1, Number(coord[0]) + 2)) {
    for (let y of range(Number(coord[1]) - 1, Number(coord[1]) + 2)) {
      coords.push(cellId(x, y));
    }
  }

  const {
    msid,
    account: { worldName },
    lobby: { cookie: lobbyCookie },
    gameworld: { session: gameworldSession, cookie: gameworldCookie }
  } = store.getState();
  const url = urls.gameworldApi`worldName: ${worldName}`;

  const { data } = await axios.post(
    `${url}/?c=map&a=getByRegionIds&t${Date.now()}`,
    {
      action: "getByRegionIds",
      controller: "map",
      params: {
        regionIdCollection: {
          "1": coords
        }
      },
      session: gameworldSession
    },
    {
      headers: {
        cookie: `${lobbyCookie}msid=${msid}; ${gameworldCookie}`,
        ...userAgent
      }
    }
  );

  regions = data.response[1].region;

  Object.keys(regions).forEach(key => {
    regions[key].forEach(cell => {
      if (!cell.resType && !cell.oasis && cell.village) {
        robberHideoutList.push(cell);
      }
    });
  });

  if (robberHideoutList.length > 0) {
    detailAttack = await sendAttack({
      target: robberHideoutList[0].id,
      villageId: capitalVillage.villageId,
      units: {
        "1": 2,
        "2": 6,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
        "10": 0,
        "11": 1
      }
    });
  }

  if (detailAttack) response.json({ message: "done" });
  else response.json({ message: "failed" });
}

module.exports = robberCleaner;
