const lobbyUrl = 'https://lobby.kingdoms.com/api'
const mellonUrl = 'https://mellon-t5.traviangames.com'

module.exports = {
  lobbyApi: `${lobbyUrl}/index.php`,
  getMsid: `${mellonUrl}/authentication/login`,
  generateToken: (_, msid) =>
    `${mellonUrl}/authentication/login/ajax/form-validate?msid=${msid}&msname=msid`,
  generateLobbySession: (_, token, msid) =>
    `${lobbyUrl}/login.php?token=${token}&msid=${msid}&msname=msid`,
}
