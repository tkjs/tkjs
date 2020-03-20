const router = require("express").Router();

const lobbyRouter = require("./lobby-route");
const gameworldRouter = require("./gameworld-route");

router.get("/", function(req, res, next) {
  res.json({ message: "Server alive!" });
});
router.use("/lobby", lobbyRouter);
router.use("/gameworld", gameworldRouter);

module.exports = router;
