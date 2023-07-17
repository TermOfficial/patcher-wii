const format = "ISO";

const path = require("path");
const { existsSync, rmSync, unlinkSync } = require("fs");

const wit = require("../lib/wit");
const DOL = require("./dol");
const utils = require("../lib/utils");

module.exports = async ({ game, gameId, region, version, inputFile }) => {

    // Extract the ISO content to tmp/iso/GAMEID/
    const isoOutputPath = path.resolve(__dirname, "../tmp/", gameId, format);
    if (existsSync(isoOutputPath)) rmSync(isoOutputPath, { recursive: true, force: true }); // wit automatically creates the folder, if it exists before wit, delete it
    
    // Extract ISO content
    await wit.extract(format, inputFile, isoOutputPath);

    // Find DOL
    const dolPath = path.resolve(isoOutputPath, "DATA/sys/main.dol");
    if (!existsSync(dolPath)) {
        logger.error(`Can't find DOL file, what the fuck happened?`);
        process.exit(1);
    };

    // Patch the DOL
    await DOL({ game, gameId, version, inputFile: dolPath, isFromFormat: true, noBackup: true });

    const patchedFilePath = utils.getPatchedFilePath(inputFile, format, game, gameId);
    // If output file exists from older patches, remove it
    if (existsSync(patchedFilePath)) {
        logger.warn(`Output file "${patchedFilePath}" already exists and it will be overwritten.`);
        rmSync(patchedFilePath, { force: true });
    };

    await wit.copy(format, isoOutputPath, patchedFilePath);
    logger.success(`Done! Your game was patched and saved to path ${patchedFilePath}`);

    // Clear TMP folder
    utils.clearTmp();
};