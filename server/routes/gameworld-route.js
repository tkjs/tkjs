const router = require("express").Router();
const GameworldController = require("../controllers/gameworld-controller");

router.get("/", GameworldController.getState);
router.get("/own-village", GameworldController.getOwnVillage);
router.post("/authenticate", GameworldController.authenticate);
router.post("/logout", GameworldController.resetState);

module.exports = router;
