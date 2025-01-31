var replacements = require('./files'),
    shell = require("shelljs");

module.exports = function () {
  console.log(replacements);

  replacements.forEach(function(replacement) {
    console.log(replacement);
    shell.exec(`sh replace.sh ${replacement.old_file} ${replacement.new_file}`);
  });
}
