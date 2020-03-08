const lobbyUrl = 'https://lobby.kingdoms.com/api'
const mellonUrl = 'https://mellon-t5.traviangames.com'
const gameworldUrl = (_, gameworld) =>
  `https://${gameworld.toLowerCase()}.kingdoms.com`

module.exports = {
  lobbyApi: `${lobbyUrl}/index.php`,
  getMsid: `${mellonUrl}/authentication/login`,
  generateToken: (_, msid) =>
    `${mellonUrl}/authentication/login/ajax/form-validate?msid=${msid}&msname=msid`,
  generateLobbySession: (_, token, msid) =>
    `${lobbyUrl}/login.php?token=${token}&msid=${msid}&msname=msid`,
  gameworldApi: (_, gameworld) =>
    `${gameworldUrl`gameworld: ${gameworld}`}/api`,
  generateGameworldToken: (_, gameworldId, msid) =>
    `${mellonUrl}/game-world/join/gameWorldId/${gameworldId}?msid=${msid}&msname=msid`,
  joinGameworld: (_, worldName, token, msid) =>
    `${gameworldUrl`gameworld: ${worldName}`}/api/login.php?token=${token}&msid=${msid}&msname=msid`,
}
