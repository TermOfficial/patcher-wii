const format = "NKIT";

module.exports = async (inputFile, outputFolder) => {
    global.logger.info(`NKit files are not supported, please convert your NKit to WBFS or ISO.`);
    process.exit();
};