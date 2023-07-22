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
    let executable = path.basename(execPath);
    let executableFileFullPath = execPath;

    // avoid the workaround if the parent process in not pkg-ed version.
    if (process.pkg) {
      // creating a temporary folder for our executable file
      const destination = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
      const destinationPath = path.join(destination, executable);
      executableFileFullPath = destinationPath;
      // copy the executable file into the temporary folder
      fs.copyFileSync(execPath, destinationPath);

      await chmod(destinationPath, 0o765); // grant permission just in case
    };

    // using {detached: true}, execute the command independently of its parent process
    // to avoid the main parent process' failing if the child process failed as well.
    return await child_exec(`${executableFileFullPath} ${command}`);
  };

};

module.exports = new ChildProcess();