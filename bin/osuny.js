#! /usr/bin/env node

const shell = require("shelljs"),
    dev = require("./dev"),
    migrate = require("./migrate/migrate");

shell.set('-e'); // exit upon first error
console.log(`
  .=*#%%#*=        -*#%%#*=.      =+-      ++.     .+ .+#%%#+.     :++      -+-
 :@@=:..:+@@.     #@#:..:+@@.     *@*      @@:     -@#@+:..-@@-    -@@      *@*
 +@*      %@=    .@@.     %@=     *@*      @@:     -@@.     *@*    -@@      *@*
 +@*      %@=     %@*     *%=     *@*      @@:     -@@      *@*    -@@      *@*
 +@*      %@=      +@@=           *@*      @@:     -@@      *@*    -@@      *@*
 +@*      %@=       .+@@+.        *@*      @@:     -@@      *@*    -@@      *@*
 +@*      %@=         .+@@+.      *@*      @@:     -@@      *@*    .@@=.   :@@=
 +@*      %@=     ==     +@@:     *@*      @@:     -@@      *@*     .+%@@@@%*-
 +@*      %@=    .@@.     +@#     *@*     .@@:     -@@      *@*         @@-
 =@%     .@@-     @@-     #@#     +@#    :#@@:     -@@      *@*         @@-
  =%@%##%@%=      :#@%##%@@*       *@@##@%=:@:     :@@      *@+         %@-
     .:..            ..:.            ...
 `);

const command = process.argv[2];

let pagefindExclude = `
    .block-agenda,
    .block-diplomas,
    .block-categories,
    .block-exhibitions,
    .block-jobs,
    .block-locations,
    .block-organizations,
    .block-pages,
    .block-papers,
    .block-persons,
    .block-posts,
    .block-programs,
    .block-projects,
    .block-publications,
    .block-volumes,
    .persons-papers,
    .persons-posts,
    .persons-programs,
    .persons-publications,
    .post-sidebar`;

function execute(string) {
    console.log("OSUNY runs " + string);
    shell.exec(string);
}

if (command === "watch") {
    execute("hugo server");
}

if (command === "dev") {
    execute("hugo");
    execute("npx pagefind --site 'public' --output-subdir '../static/pagefind' --glob '**/index.{html}' --exclude-selectors '" + pagefindExclude + "'");
    execute("hugo server");
}

if (command === "local") {
    var IP = dev.network["en0"][0] || "0.0.0.0";
    execute("hugo");
    execute("npx pagefind --site 'public' --output-subdir '../static/pagefind' --glob '**/index.{html}' --exclude-selectors '" + pagefindExclude + "'");
    execute("hugo server --bind=" + IP + " --baseURL=http://" + IP + ":1313 -D");
}

if (command === "build") {
    execute("yarn upgrade osuny");
    execute("yarn install");
    execute("hugo --minify");
    execute("npm_config_yes=true npx pagefind --site 'public' --glob '**/index.{html}' --exclude-selectors '" + pagefindExclude + "'");
}

if (command === "percy-build") {
    execute("yarn upgrade");
    execute("hugo --baseURL=/");
    execute("npm_config_yes=true npx pagefind --site 'public' --glob '**/index.{html}' --exclude-selectors '" + pagefindExclude + "'");
}

if (command === "update") {
    execute("git pull --recurse-submodules --depth 1");
    execute("git submodule update --remote");
}

if (command === "setup-example") {
    execute("git submodule add https://github.com/noesya/osuny-example");
}

if (command === "server-example") {
    execute("hugo server --config osuny-example/config/example/config.yaml");
}

if (command === "example") {
    execute("yarn setup-example > /dev/null || yarn upgrade");
    execute("yarn osuny server-example");
}

if (command === "update-theme") {
    execute("git submodule update --remote");
    execute("yarn upgrade");
}

if (command === "migrate") {
    migrate(process.argv);
}
