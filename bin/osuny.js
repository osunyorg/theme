#! /usr/bin/env node

const shell = require("shelljs"),
    dev = require("./dev"),
    migrate = require("./migrate/migrate");

shell.set('-e'); // exit upon first error
console.log(`
     +**=           ++***++     =*=        **=   =++  +***++    =**+        =*+=
  +*#%@@%#**+     *###**#%%#+   *%*       #@%*   *@%####*#%%#+  +%%%+       #@%+
=#%%#*+ #+#%%#=  #@%#    +**+-  *%*       *%%*   *%%%#=   +%%%+  *%%#      *%@#
*%%*       +%%*  #@%#           *%*       *%@*   *%%+      #@%*   *%%*    +%%%
*%#         #@*  *%@%#*****+    *%*       *%%*   *%#       +%@*    #@%*   #%%*
*@#         #%*    %#*+*+#%%#-  *%*       +@%*   *%*       *%%*     %%%* *%%*
+%%+       *%%+ =#%%      %%@+  *%#       #@%*   *%*       *%%*     #%%%#%@#
 #%%#*+ #*#%%*  =%@%#    +%%%+  +%%#*+  +#%%@+   *%*       *%@*      *%@%@%=
  +**#%@@%#*+     *#%%#*#%%#+    +#%%%###%%@@*   *%*       #@%*       #%@%*
      =**=          +#+***+        +***+   **=   =*=        **=       #%@#
                                                                      %%%
                                                                  +*#%%%#
                                                                 =+***+
`);

const command = process.argv[2];

// Pagefind is not a yarn dependency: yarn 1 downloads its binaries for every platform (~750 MB),
// whereas npx only fetches the one for the current platform, and caches it.
// The version is pinned, so prefer-offline lets npx reuse its cache without asking the registry.
let pagefindVersion = "1.5.2";
// Pagefind command, exporting to public/pagefind
// Run from the theme directory, where pagefind reads pagefind.yml (site, glob, excluded selectors)
let pagefindCommand = "cd themes/osuny && npm_config_yes=true npm_config_prefer_offline=true npx pagefind@" + pagefindVersion;
// Pagefind variant command, exporting to static/pagefind, useful for local environment
let pagefindDevCommand = pagefindCommand + " --output-subdir \"../static/pagefind\"";

function execute(string) {
    console.log("OSUNY runs " + string);
    shell.exec(string);
}

if (command === "watch") {
    execute("hugo server --minify");
}

if (command === "dev") {
    execute("rm -rf public");
    execute("hugo");
    execute(pagefindDevCommand);
    execute("hugo server --minify");
}

if (command === "local") {
    var IP = dev.network["en0"][0] || "0.0.0.0";
    execute("hugo");
    execute(pagefindDevCommand);
    execute("hugo server --minify --bind=" + IP + " --baseURL=http://" + IP + ":1313 -D");
}

if (command === "build") {
    execute("yarn upgrade osuny");
    execute("yarn install");
    execute("hugo --minify");
    execute(pagefindCommand);
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
