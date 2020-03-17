const morgan = require("morgan");
const moment = require("moment");

morgan.token("custom-date", function() {
  return moment().format("DD/MMM/YYYY HH:mm:ss");
});

morgan.token("custom-response-time", function(req, res, digits) {
  if (!req._startAt || !res._startAt) {
    // missing request and/or response start time
    return;
  }

  // calculate diff
  const ms =
    (res._startAt[0] - req._startAt[0]) * 1e3 +
    (res._startAt[1] - req._startAt[1]) * 1e-6;

  // return truncated value
  return ms.toFixed(digits === undefined ? 3 : digits) + "ms";
});

const customLog = [
  ":remote-addr",
  '":method :url :status"',
  ":custom-response-time",
  ":custom-date"
].join(" ");

module.exports = morgan(customLog);
