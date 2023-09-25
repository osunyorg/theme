#! /usr/bin/env node

const shell = require("shelljs")

console.log("");
console.log(" .=*#%%#*=        -*#%%#*=.      =+-      ++.     .+ .+#%%#+.     :++      -+-      ");
console.log(":@@=:..:+@@.     #@#:..:+@@.     *@*      @@:     -@#@+:..-@@-    -@@      *@*      ");
console.log("+@*      %@=    .@@.     %@=     *@*      @@:     -@@.     *@*    -@@      *@*      ");
console.log("+@*      %@=     %@*     *%=     *@*      @@:     -@@      *@*    -@@      *@*      ");
console.log("+@*      %@=      +@@=           *@*      @@:     -@@      *@*    -@@      *@*      ");
console.log("+@*      %@=       .+@@+.        *@*      @@:     -@@      *@*    -@@      *@*      ");
console.log("+@*      %@=         .+@@+.      *@*      @@:     -@@      *@*    .@@=.   :@@=      ");
console.log("+@*      %@=     ==     +@@:     *@*      @@:     -@@      *@*     .+%@@@@%*-       ");
console.log("+@*      %@=    .@@.     +@#     *@*     .@@:     -@@      *@*         @@-          ");
console.log("=@%     .@@-     @@-     #@#     +@#    :#@@:     -@@      *@*         @@-          ");
console.log(" =%@%##%@%=      :#@%##%@@*       *@@##@%=:@:     :@@      *@+         %@-          ");
console.log("    .:..            ..:.            ...                                             ");
console.log("");

const command = process.argv[2];

if (command === "watch") {
    console.log("watch");
    shell.exec("hugo server")
}

if (command === "dev") {
    console.log("dev");
    shell.exec("hugo");
    shell.exec("npx pagefind --site public --output-subdir ../static/pagefind")
    shell.exec("hugo server")
}

if (command === "build") {
    console.log("build");
    shell.exec("hugo");
    shell.exec("npm_config_yes=true npx pagefind --site public");
}

if (command === "update") {
    console.log("update");
    shell.exec("git pull --recurse-submodules --depth 1");
    shell.exec("git submodule update --remote");
}

if (command === "setup-example") {
    console.log("setup-example");
    shell.exec("git submodule add https://github.com/noesya/osuny-example");
}

if (command === "server-example") {
    console.log("server-example");
    shell.exec("hugo server --config osuny-example/config/example/config.yaml");
}

if (command === "example") {
    console.log("example");
    shell.exec("yarn setup-example > /dev/null || yarn update");
    shell.exec("yarn server-example");
}

if (command === "update-theme") {
    console.log("update-theme");
    shell.exec("cd themes/osuny-hugo-theme-aaa");
    shell.exec("git checkout main");
    shell.exec("git pull");
    shell.exec("cd ../..");
    shell.exec("yarn upgrade");
}
