const { range, cellId } = require("./utilities");

const regionIds = {};

for (let x of range(-13, 14)) {
  for (let y of range(-13, 14)) {
    regionIds[cellId(x, y)] = [];

    for (let xx of range(0 + x * 7, 7 + x * 7)) {
      for (let yy of range(0 + y * 7, 7 + y * 7)) {
        regionIds[cellId(x, y)].push(cellId(xx, yy));
      }
    }
  }
}

const userAgent = {
  "User-Agent":
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:73.0) Gecko/20100101 Firefox/73.0"
};

module.exports = { regionIds, userAgent };
