const fs = require('fs');
const readline = require('readline');

// Server domains
const NAS = 'nas.legacy.danceparty.lol';
const SHOP = 'shop.legacy.danceparty.lol';
const GS_WDF = 'gs-wdf.legacy.danceparty.lol';
const GS_WDF_JD5 = 'gs-wdf-jd5.legacy.danceparty.lol';
const GS_JMCS = 'gs-jmcs.legacy.danceparty.lol';
const TRACKING = 'trk-wii.legacy.danceparty.lol';

const STRINGS = {
  // NAS #
  'https://naswii.nintendowifi.net/ac': `http://${NAS}/ac`,
  'https://naswii.nintendowifi.net/pr': `http://${NAS}/pr`,
  // Shop #
  'https://ecs.shop.wii.com/ecs/services/ECommerceSOAP': `http://${SHOP}/ecs/ECommerceSOAP`,
  // WS #
  'https://wii-dance6-ws1.ubisoft.com': `http://${GS_WDF}`,
  'https://wii-dance6-ws2.ubisoft.com': `http://${GS_JMCS}`,
  'wii-dance6-ws1.ubisoft.com': GS_WDF,
  'wii-dance6-ws2.ubisoft.com': GS_JMCS,
  'wdfjd6': 'wdf-lgc',
  // Tracking #
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

const STRINGS_JD15 = {
  // NAS #
  'https://naswii.nintendowifi.net/ac': `http://${NAS}/ac`,
  'https://naswii.nintendowifi.net/pr': `http://${NAS}/pr`,
  // Shop #
  'https://ecs.shop.wii.com/ecs/services/ECommerceSOAP': `http://${SHOP}/ecs/ECommerceSOAP`,
  // WS #
  'https://wii-dance6-ws1.ubisoft.com': `http://${GS_WDF}`,
  'https://wii-dance6-ws2.ubisoft.com': `http://${GS_JMCS}`,
  'wii-dance6-ws1.ubisoft.com': GS_WDF,
  'wii-dance6-ws2.ubisoft.com': GS_JMCS,
  'wdfjd6': 'wdf-jd15',
  // Tracking #
  'https://tracking-wii-dance.ubisoft.com': `http://${TRACKING}`,
};

function patchExec(path, output) {
  const GAMES = [2018, 2017, 2016, 2015, 2014];
  const JD5_IDS = ['SJOP41', 'SJOE41', 'SJME89'];

  let jdver = 9999;

  const mainDol = fs.readFileSync(path);
  console.log('DOL file loaded successfully.');

  console.log('Fetching the Just Dance version...');
  // Gets the jdver
  for (const game of GAMES) {
    // Engine desc JD{game}_{platform}_LEGACY
    // JD5 (legacy) does not have this flag, so we check the Title Just Dance Just Dance® {game}
    if (
      mainDol.includes(`JD${game}`) ||
      mainDol.includes(`Just Dance\xAE ${game}`)
    ) {
      jdver = game;
      console.log(`jdver=${jdver}`);
      break;
    }
  }

  if (!GAMES.includes(jdver)) {
    return console.error(
      'Either the game is not supported, or you have a broken game dump.'
    );
  }

  // 2014 games and 2014 mods have the same DOL but different ID
  // and we can't detect ID from DOL so we check for boot.bin file
  if (jdver === 2014) {
    const sysPath = path.substring(0, path.lastIndexOf('/'));
    const bootPath = `${sysPath}/boot.bin`;
    if (!fs.existsSync(sysPath) || !fs.existsSync(bootPath)) {
      return console.error(
        "Are you sure you selected a DOL file that's located in DATA/sys? Can't find boot.bin file..."
      );
    }

    const bootData = fs.readFileSync(bootPath);
    const id = bootData.slice(0, 6).toString();
    if (!JD5_IDS.includes(id)) {
      return console.error(`Your 'main.dol' ID ${id} is not available to patch.`);
    }
    if (id === 'SJME89') {
      console.log('JDJAPAN detected!');
      STRINGS_JD5['wiitracking'] = 'jdjapantrkw';
      STRINGS_JD5[
        '2399fff0497ae598539ccb3a61387f67833055ad'
      ] = 'a09302313bd087b88a54fe1a010eb62ea3edbfad';
      STRINGS_JD5['JejDUqq7'] = 'DFe3qab8';
    }
  }

  // If version is 2014, replace STRINGS with STRINGS_JD5
  let STRINGS_USED = jdver === 2014 ? STRINGS_JD5 : STRINGS;
  if (jdver === 2015) {
    STRINGS_USED = STRINGS_JD15;
  }

  console.log('Patching DOL...');
  //console.log('String to replace is longer than expected:', value, "is bigger than", key);
  for (const [key, value] of Object.entries(STRINGS_USED)) {
    // key = original string
    // value = string to replace
    const keyLen = key.length;
    const valueLen = value.length;
    const keyBuffer = Buffer.from(key);
    let valueBuffer = Buffer.from(value);

    // str to replace is bigger than original value so we have to add extra 00 at the end
    if (valueLen > keyLen) {
        let diff = valueLen - keyLen;
        valueBuffer = 
        mainDol.replace(keyBuffer, valueBuffer)
    }
    

  
    // if (keyLen < valueLen) {
    // console.log('String to replace is longer than expected:', value, "is bigger than", key);
    //   keyBuffer.fill(0x00, keyLen);
    // } else if (keyLen > valueLen) {
    //   valueBuffer.fill(0x00, valueLen);
    // }
  
    // const replaceBuffer = Buffer.from(keyBuffer);
    // mainDol.forEach((byte, index) => {
    //   if (byte === replaceBuffer[0] && mainDol.slice(index, index + keyLen).equals(replaceBuffer)) {
    //     mainDol.set(valueBuffer, index);
    //     console.log(`Patched: ${key} => ${value}`);
    //   }
    // });
  }

  console.log('Patching completed.');
  fs.writeFileSync(output, mainDol);
  console.log(`Patched DOL file saved to: ${output}`);
}

const filePath = "C:\\Users\\batin\\Desktop\\main.dol"
const outputFilePath = filePath.replace('.dol', '-patched.dol');
patchExec(filePath, outputFilePath);