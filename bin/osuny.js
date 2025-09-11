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

let pagefindExclude = '';
// Agenda
pagefindExclude += '.events__section, .block-agenda, .events_categories__taxonomy, .events_categories__term, ';
pagefindExclude += '.exhibitions__section, .block-exhibitions, .exhibitions_categories__taxonomy, .exhibitions_categories__term, ';
// Categories
pagefindExclude += '.categories__taxonomy, .categories__term, ';
// Diplomas
pagefindExclude += '.diplomas__taxonomy, .block-diplomas, .diplomas_categories__taxonomy, .diplomas_categories__term, ';
// Job board
pagefindExclude += '.jobs__section, .block-jobs, .jobs_categories__taxonomy, .jobs_categories__term, ';
// Organizations
pagefindExclude += '.organizations__section, .block-organizations, .organizations_categories__taxonomy, .organizations_categories__term, ';
// Pages (there's no difference between index and single, only sections)
pagefindExclude += '.block-pages, ';
// Persons
pagefindExclude += '.persons__section, .block-persons, .administrators__term, .authors__term, .researchers__term, .teachers__term, ';
// Portfolio
pagefindExclude += '.projects__section, .block-projects, .projects_categories__taxonomy, .projects_categories__term, ';
// Posts
pagefindExclude += '.posts__section, .block-posts, .post-sidebar, .posts_categories__taxonomy, .posts_categories__term, ';
// Programs (there's no difference between index and single, only sections)
pagefindExclude += '.block-programs';


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
