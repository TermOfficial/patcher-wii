const fs = require("fs");

module.exports = (inputPath) => {

  const mainDol = fs.readFileSync(inputPath);
  let jdVersion;

  // Fetch JD Version by reading a binary flag in the DOL.
  for (const game of global.config.GAMES) {
    // We loop through each game version to see which flag exists in the DOL.
    // For 2015-2016-2017-2018: "JD{game}_{platform}_LEGACY"
    // For 2014: Just Dance® {game}
    const { version } = game;
    const flag = `JD${version}`;
    const flagJD5 = Buffer.concat([
      Buffer.from("4A7573742044616E6365AE20", "hex"), 
      Buffer.from(version.toString())
    ]);

    if (
      mainDol.includes(flag) ||
      mainDol.includes(flagJD5)
    ) {
      jdVersion = version;
      break;
    };
  };

  // If no JD Version was found
  if (!jdVersion) {
    logger.error(`The JD version couldn't be detected, are you sure it's an original & valid DOL file?`);
    process.exit(1);
  }
  else return jdVersion;
};