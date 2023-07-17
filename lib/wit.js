const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { existsSync } = require("fs");
const { resolve } = require("path");
const path = require('path');

class Wit {
    constructor() {
        let bin = resolve(__dirname, "../bin/wit/", process.platform)
        if (!existsSync(bin)) {
            global.logger.error(`Your OS does not have a corresponding WIT binary in Patcher. Please get support at our Discord server and provide the following information: ${process.platform}`);
            process.exit();
        };
        this.bin = bin;
        this.wit = resolve(this.bin, "wit");
        this.wwt = resolve(this.bin, "wwt");
        this.wdf = resolve(this.bin, "wdf");
        this.wdfCat = resolve(this.bin, "wdf-cat");
        this.wdfDump = resolve(this.bin, "wdf-dump");
    };

    async extract(format, inputPath, outputPath) {
        logger.info(`Extracting ${format} file! Please wait...`);
        try {
            const { stdout, stderr } = await exec(`${this.wit} EXTRACT "${path.normalize(inputPath)}" -d "${path.normalize(outputPath)}"`);
            if (stderr) throw stderr;
            logger.success(`Extracted ${format} file successfully.`);
          } catch (e) {
            const { code, killed, stdout, stderr } = e;

            switch(code) {
                case 4:
                    logger.error(`The file you provided is not a valid source file.`);
                    logger.error(`If your file is converted from NKIT to ISO using Dolphin, it might cause issues. Please convert it with the NKIT tools from Vimm's lair.`);
                    logger.error(`Error message from WIT: "${stderr.trim()}"`);
                    process.exit(code);
                    break;
                default:
                    logger.error(`An unknown error occured with WIT.`);
                    logger.error(`Error code: ${code}`);
                    logger.error(`Error message: "${stderr}"`);
                    process.exit(code || 1);
            }
        };
    };
    
    async copy(format, inputPath, outputPath, isWbfs = false) {
        logger.info(`Packing ${format} file! Please wait...`);
        try {
            const { stdout, stderr } = await exec(`${this.wit} COPY ${isWbfs ? "--wbfs" : ""} "${path.normalize(inputPath)}" "${path.normalize(outputPath)}"`);
            if (stderr) throw stderr;
            logger.success(`Packed ${format} file successfully.`);
          } catch (e) {
            const { code, killed, stdout, stderr } = e;

            switch(code) {
                default:
                    logger.error(`An unknown error occured with WIT.`);
                    logger.error(`Error code: ${code}`);
                    logger.error(`Error message: "${stderr}"`);
                    process.exit(code || 1);
            }
        };
    };

};

module.exports = new Wit();