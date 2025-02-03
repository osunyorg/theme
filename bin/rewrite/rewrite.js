var shell = require("shelljs");

module.exports = function () {
  shell.exec(`sh ./themes/osuny/bin/rewrite/replace.sh`);
}
