"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const c = require("ansi-styles");
const asyncro_1 = require("asyncro");
const fs = require("fs-extra");
const mp = require("multi-progress");
const DataLoader_1 = require("./lib/DataLoader");
exports.download = async (configFile, dir, saveJSON) => {
    const dvgConfig = await DataLoader_1.loadConfig(configFile);
    const config = {
        baseDirectory: await fs.realpath(dir),
        baseURL: dvgConfig.cloudRoot,
        progress: new mp(process.stderr),
        maxSimultaneousDownloads: 6
    };
    let json;
    try {
        json = await DataLoader_1.loadDvgJsonData(dvgConfig.cloudURL);
    }
    catch (err) {
        console.error("Could not load JSON:", err.message);
        return false;
    }
    const missing = await asyncro_1.filter(json.assets.assets, async (asset) => {
        return DataLoader_1.assetIsInvalid(asset, config);
    });
    console.error(`Missing ${missing.length} assets of ${json.assets.assets.length}`);
    let result = [];
    try {
        result = await DataLoader_1.downloadAll(missing, config);
    }
    catch (err) {
        console.error("Done fail");
        return false;
    }
    console.error(`Downloaded ${result.filter(o => o).length} of ${missing.length}`);
    if (result.includes(false)) {
        await Promise.all(json.assets.assets.map(async (asset) => {
            if (await DataLoader_1.assetIsInvalid(asset, config)) {
                console.error(`${c.red.open}Error:${c.red.close} ${c.yellow.open}${asset.path}${c.yellow.close}`);
            }
        }));
        return false;
    }
    if (saveJSON) {
        console.error(`Saving new JSON file ${saveJSON}`);
        try {
            await fs.outputJSON(saveJSON, json);
        }
        catch (err) {
            console.error("error " + err);
            return false;
        }
    }
    return true;
};
//# sourceMappingURL=index.js.map