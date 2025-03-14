var shell = require("shelljs");

module.exports = function (argv) {
  shell.exec(`echo "22" > .nvmrc`);
}
