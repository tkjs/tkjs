const router = require("express").Router();
const LobbyController = require("../controllers/lobby-controller");

router.get("/", LobbyController.getState);
router.get("/avatar-list", LobbyController.getAvatar);
router.post("/authenticate", LobbyController.authenticate);
router.patch("/logout", LobbyController.resetState);

module.exports = router;
