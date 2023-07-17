const format = "WBFS";

const path = require("path");
const { existsSync, rmSync, unlinkSync } = require("fs");

const wit = require("../lib/wit");
const DOL = require("./dol");
const utils = require("../lib/utils");

module.exports = async ({ game, gameId, region, version, inputFile }) => {

    // Extract the WBFS content to tmp/WBFS/GAMEID/
    const tmpFolder = utils.tmpFolder();
    const wbfsOutputPath = path.resolve(tmpFolder, gameId, format);
    
    // Extract WBFS content
    await wit.extract(format, inputFile, wbfsOutputPath);

    // Find DOL
    const dolPath = path.resolve(wbfsOutputPath, "DATA/sys/main.dol");
    if (!existsSync(dolPath)) {
        logger.error(`Can't find DOL file, what the fuck happened?`);
        process.exit(1);
    };

    // Patch the DOL
    await DOL({ game, gameId, version, inputFile: dolPath, isFromFormat: true, noBackup: true });

    const patchedFilePath = utils.getPatchedFilePath(inputFile, format, game, gameId);
    // If output file exists from older patches, remove it
    if (existsSync(patchedFilePath)) {
        logger.warn(`Output path "${patchedFilePath}" already exists and it will be overwritten.`);
        rmSync(patchedFilePath, { force: true });
    };

    await wit.copy(format, wbfsOutputPath, patchedFilePath, true);
    logger.success(`Done! Your game was patched and saved to path ${patchedFilePath}`);

    // Clear TMP folder
    utils.removeTmpFolder(tmpFolder);
};