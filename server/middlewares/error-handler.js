module.exports = function(err, req, res, next) {
  console.log(err);
  switch (err.name) {
    case "BadRequest":
      let errors = Array.isArray(err.message) ? err.message : [err.message];

      res.status(400).json({ errors });
      break;

    case "Forbidden":
      res.status(403).json({ errors: [err.message] });
      break;

    default:
      res.status(500).json({ errors: [err] });
      break;
  }
};
