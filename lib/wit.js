const { existsSync, readdirSync } = require("fs");
const { resolve } = require("path");
const path = require('path');

const childProcess = require("./child-process");
const utils = require("./utils");

class WIT {
    constructor() {
        let bin = resolve(global.root, "bin/wit/", process.platform);
        if (!existsSync(bin)) {
            global.logger.error(`Your OS does not have a corresponding WIT binary in Patcher. Please get support at our Discord server and provide the following information: ${process.platform}`);
            process.exit(1);
        };
        this.wit = resolve(bin, (process.platform == "win32" ? "wit.exe" : "wit"));
    };

    async extract(format, inputPath, outputPath) {
        global.logger.info(`Extracting ${format} file! Please wait...`);

        try {
            
            const {
                isPkg,
                execFolder,
                exec: { stderr, stdout }
            } = await childProcess.exec(this.wit, `EXTRACT "${path.normalize(inputPath)}" -d "${path.normalize(outputPath)}"`);

            if (stderr) throw stderr;
            global.logger.success(`Extracted ${format} file successfully.`);

            if (isPkg) {
                utils.removeTmpFolder(execFolder);
            };

        } catch (err) {

            const { code, killed, stdout, stderr } = err;

            switch (code) {
                case 4:
                    global.logger.error(`The file you provided is not a valid source file.`);
                    global.logger.error(`If your file is converted from NKIT to ISO using Dolphin, it might cause issues. Please convert it with the NKIT tools from Vimm's lair.`);
                    global.logger.error(`Error message from WIT: "${stderr.trim()}"`);
                    process.exit(code);
                    break;
                default:
                    global.logger.error(`An unknown error occured with WIT.`);
                    global.logger.error(`Error code: ${code}`);
                    global.logger.error(`Error message: "${stderr}"`);
                    console.error(err)
                    process.exit(code || 1);
            };

        };
    };

    async copy(format, inputPath, outputPath, isWbfs = false) {
        global.logger.info(`Packing ${format} file! Please wait...`);

        try {

            const {
                isPkg,
                execFolder,
                exec: { stderr, stdout }
            } = await childProcess.exec(this.wit, `COPY ${isWbfs ? "--wbfs" : ""} "${path.normalize(inputPath)}" "${path.normalize(outputPath)}"`);

            if (stderr) throw stderr;
            global.logger.success(`Packed ${format} file successfully.`);

            if (isPkg) {
                utils.removeTmpFolder(execFolder);
            };

        } catch (err) {

            const { code, killed, stdout, stderr } = err;

            switch (code) {
                default:
                    global.logger.error(`An unknown error occured with WIT.`);
                    global.logger.error(`Error code: ${code}`);
                    global.logger.error(`Error message: "${stderr}"`);
                    process.exit(code || 1);
            };
        };

    };
};

module.exports = new WIT();