#! /usr/bin/env node

const shell = require("shelljs");
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
    .administrators__term,
    .authors__term,
    .categories__taxonomy, .categories__term,
    .posts-categories__taxonomy, .posts-categories__term,
    .events-categories__taxonomy, .events-categories__term,
    .diplomas__taxonomy, .block-diplomas,
    .events__section, .block-agenda,
    .organizations__section, .block-organizations,
    .pages__section, .block-pages,
    .persons__section, .block-persons, 
    .posts__section, .block-posts, .post-sidebar, 
    .programs__section, .block-programs,
    .researchers__term,
    .teachers__term
    `;

function execute(string) {
    console.log("OSUNY runs " + string);
    shell.exec(string);
}

if (command === "watch") {
    execute("hugo server");
}

if (command === "dev") {
    execute("hugo");
    execute("npx pagefind --site 'public' --output-subdir '../static/pagefind' --exclude-selectors '" + pagefindExclude + "'");
    execute("hugo server");
    
}

if (command === "build") {
    execute("yarn upgrade");
    execute("hugo");
    execute("npm_config_yes=true npx pagefind --site 'public' --exclude-selectors '" + pagefindExclude + "'");
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
    execute("cd themes/osuny-hugo-theme-aaa");
    execute("git checkout main");
    execute("git pull");
    execute("cd ../..");
    execute("yarn upgrade");
}
