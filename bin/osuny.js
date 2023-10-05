#! /usr/bin/env node

const shell = require("shelljs");

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
    .pages__section, .block-pages,
    .posts__section, .block-posts, .post-sidebar,
    .organizations__section, .block-partners, .block-organizations,
    .persons__section, .block-organization_chart, .block-people, .block-persons,
    .programs__section, .block-programs,
    .events__section, .block-agenda,
    .diplomas__taxonomy, .block-diplomas`;


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
    execute("yarn setup-example > /dev/null || yarn update");
    execute("yarn server-example");
}

if (command === "update-theme") {
    execute("cd themes/osuny-hugo-theme-aaa");
    execute("git checkout main");
    execute("git pull");
    execute("cd ../..");
    execute("yarn upgrade");
}
