var data = require('./files'),
    shell = require("shelljs");

// module.exports = function () {
//   data.forEach(function(replacement) {
//     if (replacement.old_file && replacement.new_file) {
//       console.log(`convert ${replacement.old_file} to ${replacement.new_file}`);
//       shell.exec(`sh ./themes/osuny/bin/rewrite/replace.sh ${replacement.old_file} ${replacement.new_file}`);
//     }
//   });
// }

module.exports = function () {
  shell.exec(`sh ./themes/osuny/bin/rewrite/replace_2.sh`);
}
