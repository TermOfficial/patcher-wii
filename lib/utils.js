const fs = require("fs");
const fse = require('fs-extra');
const path = require("path");
const utils = require('util');
const os = require("node:os");

const exec = utils.promisify(require('child_process').exec);
const copyFile = utils.promisify(fs.copyFile);
const chmod = utils.promisify(fs.chmod);

const Games = require("./games");
const dolGameFinder = require("./dol-game-finder");

class Utils {
  constructor() { };

  async detectFormat(inputPath) {

    const games = new Games();
    const ext = path.extname(inputPath);

    // ISO file
    if (ext == ".iso") {

      return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(inputPath, { start: 0, end: 5 });
        let data = "";

        // Read the stream
        stream.on("data", (chunk) => {
          data += chunk;
        });

        // Process the data
        stream.on("end", () => {
          const gameId = data.toString();
          const isGameAvailable = games.isAvailable(gameId);
          if (!isGameAvailable) {
            logger.error(
              `${gameId} is not an available game to patch, please patch an available game.`
            );
            process.exit();
          }
          resolve({ gameId, format: "ISO" });
        });

        // Handle stream errors
        stream.on("error", (error) => {
          reject(error);
        });
      });

    }

    // WBFS file
    else if (ext == ".wbfs") {

      return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(inputPath, { start: 0, end: 517 });
        let data = "";

        // Read the stream
        stream.on("data", (chunk) => {
          data += chunk;
        });

        // Process the data
        stream.on("end", () => {
          
          const header = data.slice(0, 4);
          if (header !== "WBFS") { logger.error(`Invalid WBFS file`); process.exit(1); }
    
          const gameId = data.slice(data.length-6, data.length);
          const isGameAvailable = games.isAvailable(gameId);
          if (!isGameAvailable) {
            logger.error(
              `${gameId} is not an available game to patch, please patch an available game.`
            );
            process.exit();
          }
          resolve({ gameId, format: "WBFS" });

        });

        // Handle stream errors
        stream.on("error", (error) => {
          reject(error);
        });
      });

    }

    // DOL file
    else if (ext == ".dol") {

      return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(inputPath, { start: 0, end: 7 });
        let data = "";

        // Read the stream
        stream.on("data", (chunk) => {
          data += chunk;
        });

        // Process the data
        stream.on("end", () => {
          
          const dolSignature = Buffer.from("0000010000002820", "hex");
          if (dolSignature.equals(Buffer.from(data))) {
            
            const jdVersion = dolGameFinder(inputPath);
            const isGameAvailable = games.isAvailable(jdVersion);
            if (!isGameAvailable) {
              logger.error(
                `${jdVersion} is not an available game to patch, please patch an available game.`
              );
              process.exit();
            }
            resolve({ version: jdVersion, format: "DOL" });

          }
          else {
            logger.error(`Input is not a valid DOL file, please provide a valid DOL file.`);
            process.exit(1);
          };

        });

        // Handle stream errors
        stream.on("error", (error) => {
          reject(error);
        });
      });
    }

    // Nkit file (not supported)
    else if (ext == ".gcz" || ext == ".nkit" || ext == ".nkit.gcz") {
      logger.warn(`NKit files are not currently supported, please convert it to an ISO or a WBFS.`);
      process.exit();
    }

    // Cant detect
    else {
      return null;
    };
  };

  clearTmp(gameId, format) {
    let p = path.resolve(global.root, "tmp");
    if (gameId) p = path.resolve(p, gameId);
    if (format) p = path.resolve(p, format);
    fs.rmSync(p, { recursive: true, force: true });
  };

  getPatchedFilePath(inputPath, format, game, gameId) {
    const originalDir = path.dirname(inputPath);
    const name = `DanceParty Legacy (${game.version}) ${gameId} (${game.ids[gameId].r}).${format.toLowerCase()}`;
    return path.resolve(originalDir, name);
  };

  tmpFolder() {
    return fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
  };

  removeTmpFolder(tmpFolder) {
    return fs.rmSync(tmpFolder, { recursive: true });
  };
};

module.exports = new Utils();