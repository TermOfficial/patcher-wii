require("dotenv").config();

const { resolve } = require("path");
const { existsSync, statSync } = require("fs");

const config = require("./config");
const cli = require("./lib/cli");
const patcher = require('./lib/patcher');
const utils = require("./lib/utils");
const logger = require("./lib/logger");

const Games = require("./lib/games");

const ISO = require("./formats/iso");
const WBFS = require("./formats/wbfs");
const DOL = require("./formats/dol");

// Entry function
(async () => {
  // Call CLI
  const args = cli();
  // Set global variables
  global.root = __dirname;
  global.args = args;
  global.logLevel = args.logLevel || process.env.LOG_LEVEL;
  global.logger = logger;
  global.config = config;

  const inputPath = args["_"][0]; // Input file
  if (!existsSync(inputPath) || !statSync(inputPath).isFile()) {
    logger.error(`Provided path does not exist or it's not a file, please provide an ISO, WBFS or a DOL file.`);
    process.exit(1);
  }

  const detectedFormat = await utils.detectFormat(inputPath);
  if (!detectedFormat) {
    logger.error(`Couldn't detect the format of the input file, please provide an ISO, WBFS or a DOL file.`);
    process.exit(1);
  };

  let { format, gameId, version } = detectedFormat;

  const games = new Games();

  let game;
  let region;

  // DOL file can only detect jdVersion, not region
  if (format == "DOL") {
    game = games.getGameByVersion(version);
    logger.info(`Detected format: ${format}`);
    logger.info(`Detected game: ${game.version}`);
  }
  // WBFS and ISO
  else {
    game = games.getGameById(gameId);
    region = game.ids[gameId].r;
    logger.info(`Detected format: ${format}`);
    logger.info(`Detected game: ${game.version} / ${gameId} (${region})`);
  };

  switch(format) {
    case "ISO":
        return ISO({ game, gameId, region, version: game.version, inputFile: inputPath });
      break;
    case "WBFS":
      return WBFS({ game, gameId, region, version: game.version, inputFile: inputPath });
      break;
    case "DOL":
      return DOL({ version: game.version, inputFile: inputPath })
      break;
  };

  return

  const inputDolPath = resolve(dolPath);
  if (!existsSync(inputDolPath)) {
    logger.error(`${inputDolPath} does not exist, please provide a correct path.`);
    process.exit(1);
  };
  
  return patcher(inputDolPath);
})();