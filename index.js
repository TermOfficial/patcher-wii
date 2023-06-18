const { resolve } = require("path");

const cli = require("./cli");
const patcher = require('./patcher');
const { existsSync } = require("fs");

(() => {
  const args = cli();
  global.args = args;
  global.logLevel = args.logLevel;
  global.logger = require("./logger");

  const dolPath = args["_"][0];
  const inputDolPath = resolve(dolPath);
  if (!existsSync(inputDolPath)) {
    global.logger.error(`${inputDolPath} does not exist, please provide a correct path.`);
    process.exit(1);
  };
  
  return patcher(inputDolPath);
})();