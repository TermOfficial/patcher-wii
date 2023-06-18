// Taken from DP Gameserver, but modified
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const project = require("./package.json");

module.exports = () => {
    console.log()
    console.log(`PatcherWii for DanceParty (v${project.version})`);
    console.log(`Only games & mods between and including 2014 and 2018 are supported.`)
    console.log("---------------------------------")

    return yargs(hideBin(process.argv))
    .command('<dol_file>', 'Patch a DOL File', (yargs) => {
        return yargs
          .positional('dol_file', {
            describe: 'Path to the DOL file in DATA/sys',
            demandOption: true
          })
      }, (argv) => {
        return argv
    })
    .option("log-level", {
        type: "string",
        alias: "l",
        default: 'success',
        description: `Logging level`
    })
    .scriptName(project.name)
    .demandCommand()
    .showHelpOnFail()
    .parse()
}