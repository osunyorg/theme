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
// Categories: No list of categories
pagefindExclude += '.categories__taxonomy, .categories__term, ';
pagefindExclude += '.posts_categories__taxonomy, .posts_categories__term, ';
pagefindExclude += '.events_categories__taxonomy, .events_categories__term, ';
// Diplomas: No list of diplomas or block diplomas
pagefindExclude += '.diplomas__taxonomy, .block-diplomas, ';
// Agenda events: No list of events or block events
pagefindExclude += '.events__section, .block-agenda, ';
// Organizations: No list of organizations or block organizations
pagefindExclude += '.organizations__section, .block-organizations, ';
// Pages: No block pages (there's no difference between list and page)
pagefindExclude += '.block-pages, ';
// Persons: no list or block
pagefindExclude += '.persons__section, .block-persons, ';
// No list of people's facets
pagefindExclude += '.administrators__term, .authors__term, .researchers__term, .teachers__term,';
// Posts: no list, block posts, or post sidebar
pagefindExclude += '.posts__section, .block-posts, .post-sidebar, ';
// Programs: no block
pagefindExclude += '.block-programs';


function execute(string) {
    console.log("OSUNY runs " + string);
    shell.exec(string);
}

function isSearchActive() {
    // All Osuny sites have the error.html page. If it contains the string 'wasm-unsafe-eval', then search is active.
    // We can't parse the YAML config file as we don't know about the current environment.
    var str = shell.cat('public/error.html');
    return str.indexOf('wasm-unsafe-eval') !== -1;
}

function runSearchIndexingForLocalDev() {
    if (isSearchActive()) {
        // Required to generate the public folder for indexing
        execute("hugo");
        execute("npm_config_yes=true npx pagefind --site 'public' --output-subdir '../static/pagefind' --glob '**/index.{html}' --exclude-selectors '" + pagefindExclude + "'");
    }
}

function runSearchIndexing() {
    if (isSearchActive()) {
        execute("npm_config_yes=true npx pagefind --site 'public' --glob '**/index.{html}' --exclude-selectors '" + pagefindExclude + "'");
    }
}

if (command === "watch") {
    execute("hugo server");
}

if (command === "dev") {
    runSearchIndexingForLocalDev();
    execute("hugo server");
}

if (command === "local") {
    var IP = dev.network["en0"][0] || "0.0.0.0";
    runSearchIndexingForLocalDev();
    execute("hugo server --bind=" + IP + " --baseURL=http://" + IP + ":1313 -D");
}

if (command === "build") {
    execute("yarn upgrade");
    execute("hugo --minify");
    runSearchIndexing();
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
