const fs = require("fs");
const fse = require('fs-extra');
const path = require("path");
const utils = require('util');
const os = require("node:os");

const child_exec = utils.promisify(require('child_process').exec);
const chmod = utils.promisify(fs.chmod);

class ChildProcess {
  constructor() {};

  async exec(execPath, command) {
    let execName = path.basename(execPath);
    let execFolder = path.dirname(execPath);

    // avoid the workaround if the parent process in not pkg-ed version.
    if (process.pkg) {
      // creating a temporary folder for our executable file
      const tmp = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);

      const tmpFolder = path.join(tmp, path.relative(global.root, execFolder));
      const tmpExecPath = path.join(tmpFolder, execName);

      logger.debug(`exec path copying... tmp folder: ${tmpFolder}`);

      fse.copySync(execFolder, tmpFolder, { force: true, recursive: true });

      execPath = tmpExecPath;
      execFolder = tmpFolder;

      await chmod(tmpExecPath, 0o765); // grant permission just in case
    };

    // using {detached: true}, execute the command independently of its parent process
    // to avoid the main parent process' failing if the child process failed as well.
    return { 
      isPkg: process.pkg, 
      execPath, 
      execFolder, 
      execName,
      exec: await child_exec(`${execPath} ${command}`)
    };
  };

};

module.exports = new ChildProcess();