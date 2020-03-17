const axios = require("axios");

const url = require("../constants/urls");
const userAgent = require("../constants/user-agent");
const { extractMsid } = require("./extractor");

async function getMsid() {
  const { data } = await axios.get(url.getMsid, { headers: { ...userAgent } });
  return extractMsid(data);
}

module.exports = { getMsid };
