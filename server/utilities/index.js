const fs = require("fs");
const path = require("path");
const filename = path.basename(__filename);
const modules = {};

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 && file !== filename && file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    const moduleObj = require(`./${file}`);
    Object.keys(moduleObj).forEach(key => (modules[key] = moduleObj[key]));
  });

module.exports = modules;
