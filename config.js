// Game versions
const PAL = "PAL";
const NTSC = "NTSC";

// Server domains
const NAS = '12000.termy.lol';
const SHOP = '42000.termy.lol';
const GS_WDF = '6000.termy.lol';
const GS_WDF_JD5 = '6000.termy.lol';
const GS_RHODE = '3001.termy.lol';
const TRACKING = '30000.termy.lol';

// Room names
const ROOM_LEGACY = "legacy"; // 2016 - 2017 - 2018 and above
const ROOM_JD2015 = "jd2015"; // 2015
const ROOM_JD5 = "jd5"; // 2014

// NAS
const NAS_SERVICE = {
    'https://naswii.nintendowifi.net/ac': `http://${NAS}/ac`,
    'https://naswii.nintendowifi.net/pr': `http://${NAS}/pr`,
};

// SHOP
const SHOP_SERVICE = {
    'https://ecs.shop.wii.com/ecs/services/ECommerceSOAP': `http://${SHOP}/ecs/ECommerceSOAP`
};

// WDF
const WDF = (room) => {
    if (room == ROOM_JD5)
        return {
            'https://tracking-wii-dance.ubisoft.com/wdf/': `http://${GS_WDF_JD5}/${ROOM_JD5}/`,
        };
    else return {
        'https://wii-dance6-ws1.ubisoft.com/wdfjd6': `http://${GS_WDF}/${room}`,
        'https://wii-dance6-ws1.ubisoft.com': `http://${GS_WDF}`,
        'wdfjd6': room,
        'wii-dance6-ws1.ubisoft.com': GS_WDF,
    };
};

// RHODE (JMCS)
const RHODE_SERVICE = {
    'https://wii-dance6-ws2.ubisoft.com': `http://${GS_RHODE}`,
};

// TRACKING
const TRACKING_SERVICE = {
    'https://tracking-wii-dance.ubisoft.com': `http://${TRACKING}`,
};

// Strings for LEGACY replacement
module.exports.STRINGS_LEGACY = {
    ...NAS_SERVICE,
    ...SHOP_SERVICE,
    ...WDF(ROOM_LEGACY),
    ...RHODE_SERVICE,
    ...TRACKING_SERVICE
};

// Strings for JD2015 replacement
// Use the same strings as Legacy but replace legacy room name with JD2015
module.exports.STRINGS_2015 = {
    ...this.STRINGS_LEGACY,
    [ROOM_LEGACY]: ROOM_JD2015
};

// Strings for JD2014 replacement
module.exports.STRINGS_2014 = {
    ...NAS_SERVICE,
    ...SHOP_SERVICE,
    ...WDF(ROOM_JD5),
    ...TRACKING_SERVICE
};

module.exports.GAMES = [
    { version: 2018, ids: { SE8P41: { r: PAL }, SE8E41: { r: NTSC } } },
    { version: 2017, ids: { SZ7P41: { r: PAL }, SZ7E41: { r: NTSC } } },
    { version: 2016, ids: { SJNP41: { r: PAL }, SJNE41: { r: NTSC } } },
    { version: 2015, ids: { SE3P41: { r: PAL }, SE3E41: { r: NTSC } }, isJD15: true },
    { version: 2014, ids: { SJOP41: { r: PAL }, SJOE41: { r: NTSC } }, isJD14: true }
];

// Game IDs for JD2014 (including mods)
module.exports.JD5_IDS = [
    'SJOP41', // JD2014 PAL
    'SJOE41', // JD2014 NTSC
    'SJME89' // JDJAPAN PAL
];

// These are our old server domains, this is used to detect DOL files with old URLs.
module.exports.OLD_DOMAINS = ["danceparty.online", "dancepartyonline.tk"];
