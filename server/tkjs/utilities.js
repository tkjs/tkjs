const { InternalError } = require("../errors");

function extractMsid(source) {
  const msid = /msid=([\w]*)&msname/g.exec(source);
  if (!msid) throw { name: "BadRequest", message: "msid not found" };
  return msid[1];
}

function extractToken(source) {
  const token = /token=([\w]*)&msid/g.exec(source);
  if (!token) throw { name: "BadRequest", message: "Token not found" };
  return token[1];
}

function extractSession(source) {
  const session = /%7B%22key%22%3A%22([\w]*)%22%2C%22/g.exec(source);
  if (!session) throw { name: "BadRequest", message: "session not found" };
  return session[1];
}

function extractSessionAge(cookieString) {
  return new Date(cookieString.split(";")[1].split("=")[1]);
}

function extractor({ type, value }) {
  switch (type) {
    case "msid":
      return extractMsid(value);
      break;

    case "token":
      return extractToken(value);
      break;

    case "session":
      return extractSession(value);
      break;

    case "session age":
      return extractSessionAge(value);
      break;

    default:
      throw new InternalError(`Unhandled extractor type: ${type}`);
  }
}

function range(start, stop, step) {
  if (typeof stop == "undefined") {
    // one param defined
    stop = start;
    start = 0;
  }

  if (typeof step == "undefined") {
    step = 1;
  }

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    return [];
  }

  var result = [];
  for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i);
  }

  return result;
}

function cellId(x, y) {
  const rx = 536887296 + x;
  const ry = y * 32768;
  return rx + ry;
}

function reverseId(cellId) {
  let xcord, ycord;
  let binary = parseInt(cellId, 10).toString(2);

  if (binary.length < 30) binary = "0" + binary;

  xcord = binary.slice(15);
  ycord = binary.slice(0, 15);

  const realx = parseInt(xcord, 2) - 16384;
  const realy = parseInt(ycord, 2) - 16384;

  return [realx, realy];
}

module.exports = {
  range,
  cellId,
  extractor,
  reverseId,
  extractMsid,
  extractToken,
  extractSession,
  extractSessionAge
};
