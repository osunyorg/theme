var shell = require("shelljs");

module.exports = function (argv) {
  var path = argv[3] || ''
  shell.exec(`sh ./themes/osuny/bin/migrate/files/replace.sh ${path}`);
}
