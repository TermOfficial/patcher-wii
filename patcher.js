const fs = require('fs');
const { resolve, dirname } = require('path');
const replace = require('buffer-replace');

// Server domains
const NAS = 'nas.lgc.danceparty.lol';
const SHOP = 'shop.lgc.danceparty.lol';
const GS_WDF = 'gs-wdf.lgc.danceparty.lol';
const GS_WDF_JD5 = 'gs-wdf-jd5.lgc.danceparty.lol';
const GS_RHODE = 'gs-rhode.lgc.danceparty.lol';
const TRACKING = 'trk-wii.lgc.danceparty.lol';

const STRINGS = {
  /* --- NAS --- */
  'https://naswii.nintendowifi.net/ac': `http://${NAS}/ac`,
  'https://naswii.nintendowifi.net/pr': `http://${NAS}/pr`,
  /* --- NAS --- */

  /* --- SHOP --- */
  'https://ecs.shop.wii.com/ecs/services/ECommerceSOAP': `http://${SHOP}/ecs/ECommerceSOAP`,
  
  /* --- WDF (GS) --- */
  'https://wii-dance6-ws1.ubisoft.com/wdfjd6': `http://${GS_WDF}/wdflgc`,
  'https://wii-dance6-ws1.ubisoft.com': `http://${GS_WDF}`,

  /* --- JMCS (GS) --- */
  'https://wii-dance6-ws2.ubisoft.com': `http://${GS_RHODE}`,
  
  'wii-dance6-ws1.ubisoft.com': GS_WDF,
  'wii-dance6-ws2.ubisoft.com': GS_RHODE,

  /* --- JMCS (GS) --- */
  'https://tracking-wii-dance.ubisoft.com': `http://${TRACKING}`,
};

const STRINGS_JD15 = {
  /* --- NAS --- */
  'https://naswii.nintendowifi.net/ac': `http://${NAS}/ac`,
  'https://naswii.nintendowifi.net/pr': `http://${NAS}/pr`,
  /* --- NAS --- */

  /* --- SHOP --- */
  'https://ecs.shop.wii.com/ecs/services/ECommerceSOAP': `http://${SHOP}/ecs/ECommerceSOAP`,
  
  /* --- WDF (GS) --- */
  'https://wii-dance6-ws1.ubisoft.com/wdfjd6': `http://${GS_WDF}/wdfjd6`,
  'https://wii-dance6-ws1.ubisoft.com': `http://${GS_WDF}`,

  /* --- JMCS (GS) --- */
  'https://wii-dance6-ws2.ubisoft.com': `http://${GS_RHODE}`,
  
  'wii-dance6-ws1.ubisoft.com': GS_WDF,
  'wii-dance6-ws2.ubisoft.com': GS_RHODE,

  /* --- JMCS (GS) --- */
  'https://tracking-wii-dance.ubisoft.com': `http://${TRACKING}`,
};

const STRINGS_JD5 = {
  // NAS #
  'https://naswii.nintendowifi.net/ac': `http://${NAS}/ac`,
  'https://naswii.nintendowifi.net/pr': `http://${NAS}/pr`,
  // Shop #
  'https://ecs.shop.wii.com/ecs/services/ECommerceSOAP': `http://${SHOP}/ecs/ECommerceSOAP`,
  // WDF #
  'https://tracking-wii-dance.ubisoft.com/wdf/': `http://${GS_WDF_JD5}/wdf/`,
  // Tracking #
  'https://tracking-wii-dance.ubisoft.com/': `http://${TRACKING}`,
};

module.exports = (inputDolPath) => {
    const logger = global.logger;
    
    const GAMES = [2018, 2017, 2016, 2015, 2014]; // Game versions
    const JD5_IDS = ['SJOP41', 'SJOE41', 'SJME89']; // Game IDs for JD5
  
    let mainDol = fs.readFileSync(inputDolPath);
    let jdVersion;

    // Check if the dol contains any old server URLs we used before.
    let oldDomains = ["danceparty.online", "dancepartyonline.tk", "justdanceonline.net"];
    oldDomains.forEach(d => {
        if (mainDol.includes(Buffer.from(d))) {
            logger.error(`Your DOL file is not an original file because it contains our old servers and must be updated. Please update it by patching the original DOL file.`);
            process.exit(1);
        };
    });

    logger.success('DOL file loaded successfully.');
  
    // Fetch JD Version by reading a binary flag in the DOL.
    logger.info('Fetching the Just Dance version...');
    for (const game of GAMES) {
      // Engine desc JD{game}_{platform}_LEGACY
      // JD5 (legacy) does not have this flag, so we check the Title Just Dance Just Dance® {game}
      if (
        mainDol.includes(`JD${game}`) ||
        mainDol.includes(`Just Dance\xAE ${game}`)
      ) {
        jdVersion = game;
        break;
      };
    };
  
    // If no JD Version was found
    if (!jdVersion) {
      logger.error(`The JD version couldn't be detected, are you sure it's a valid and an original file?`);
      process.exit(1);
    }
    else logger.success(`Detected JD game version: ${jdVersion}`);
  
    // If game is not in the supported list
    if (!GAMES.includes(jdVersion)) {
      logger.error(
        "Either the game is not supported, or you have a broken game dump."
      );
      process.exit(1);
    };
  
    // 2014 games and 2014 mods have the same DOL but different ID
    // and we can't detect ID from DOL (for 2014 only) so we check for boot.bin file
    if (jdVersion === 2014) {
      const sysPath = inputDolPath.substring(0, inputDolPath.lastIndexOf('/'));
      const bootPath = `${sysPath}/boot.bin`;
      // Check if boot.bin exists
      if (!fs.existsSync(sysPath) || !fs.existsSync(bootPath)) {
        logger.error(
          "Are you sure you selected a DOL file that's located in DATA/sys? Can't find boot.bin file..."
        );
        process.exit(1);
      }
  
      // Read boot.bin data and determine the game ID
      const bootData = fs.readFileSync(bootPath);
      const id = bootData.slice(0, 6).toString();
      // Check if the JD5 game is available to patch
      if (!JD5_IDS.includes(id)) {
        logger.error(`Your 'main.dol' ID ${id} is not available to patch.`);
        process.exit(1);
      }
      // Depending on some JD5 games, we need to change tracking 
      // information to tell the difference while data is sent to tracking.
      switch (id) {
        case "SJME89":
          logger.info("JDJAPAN (SJME89) was detected.");
          STRINGS_JD5['wiitracking'] = 'jdjapan-trk';
          STRINGS_JD5['2399fff0497ae598539ccb3a61387f67833055ad'] = 'a09302313bd087b88a54fe1a010eb62ea3edbfad';
          STRINGS_JD5['JejDUqq7'] = 'DFe3qab8';
      }
    };
  
    // If version is 2014, replace STRINGS with STRINGS_JD5
    let STRINGS_USED = jdVersion === 2014 ? STRINGS_JD5 : STRINGS;
    // If version is 2015, replace STRINGS with STRINGS_JD15
    if (jdVersion === 2015) STRINGS_USED = STRINGS_JD15;

    // Before patching starts, make sure to backup the original DOL file
    const backupDolPath = resolve(dirname(inputDolPath), `backup-dol-${jdVersion}.dol`);
    fs.copyFileSync(inputDolPath, backupDolPath);
  
    logger.info('Patching DOL...');

    let index = 0;
    for (const [key, value] of Object.entries(STRINGS_USED)) {
      // key = original string
      // value = string to replace
      const keyLen = key.length;
      const valueLen = value.length;
      const keyBuffer = Buffer.from(key);
      let valueBuffer = Buffer.from(value);
  
      // str to replace is shorter than original value so we have to add extra 00 at the end
      if (keyLen > valueLen) {
        logger.debug("---------- VALUE SHORTER THAN ORIGINAL ----------")
        const diff = keyLen - valueLen;
        const nulls = Array(diff).fill('00').join('');
        const nullsBuf = Buffer.from(nulls, 'hex');
        valueBuffer = Buffer.concat([valueBuffer, nullsBuf]);
        logger.debug(`${value} is shorter than ${key} with difference: ${keyLen-valueLen} / ${keyLen} ${valueLen}`);
        logger.debug()
        logger.debug("------------------------------------------------")
      };
  
      if (mainDol.includes(keyBuffer)) {
        replacedData = replace(mainDol, keyBuffer, valueBuffer);
        mainDol = replacedData;
        index += 1;
        logger.debug(`Replaced ${key} with ${value} / key len: ${keyLen} , val len: ${valueLen}`)
      }
      else {
        // Only throw error about missing Shop URL 
        // if the game has a shop feature but the URL is missing (which is unlikely to happen?)
        if(!key.includes("shop.wii.com")) {
          logger.debug(`${key} doesn't exist in the DOL file, are you sure it's the original file?`)
        };
      };
    };
  
    // If there was no modified strings
    if (index == 0) {
      logger.warn(`None of the strings were replaced, which means your DOL file was not patched. Are you sure it's the original file?`);
      process.exit(1);
    };
  
    logger.success('Patching completed!');

    // Patching was completed, save the file
    const outputDolPath = resolve(dirname(inputDolPath), `main.dol`);
    fs.writeFileSync(outputDolPath, mainDol);
    logger.success(`Patched DOL file saved to: ${outputDolPath}`);
    logger.success(`You can now pack the game or run it from "main.dol" file on Dolphin!`);

    // Exit in 5
    console.log("Exiting in 5 seconds...")
    setTimeout(function() {
      process.exit();
    }, 5000);
};