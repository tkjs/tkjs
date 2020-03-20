module.exports = function(err, req, res, next) {
  console.log(err);
  console.log(err.name);
  res.status(500).json({ message: "Check server console" });
};
