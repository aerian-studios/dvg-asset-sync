"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const index_1 = require("./index");
const argv = yargs
    .options({
    configFile: {
        alias: "c",
        demandOption: true,
        describe: "Config file (update_profile.json)"
    },
    dir: {
        alias: "d",
        describe: "Target directory for files",
        demandOption: true
    },
    saveJSON: {
        alias: "j",
        describe: "Filename to save the new JSON if successful"
    }
})
    .help().argv;
index_1.download(argv.configFile, argv.dir, argv.saveJSON).then(result => process.exit(result ? 0 : -1));
//# sourceMappingURL=cli.js.map