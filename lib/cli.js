// Taken from DP Gameserver, but modified
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const project = require("../package.json");

module.exports = () => {
    console.log()
    console.log(`PatcherWii for DanceParty (v${project.version})`);
    console.log(`Only games & mods between and including 2014 and 2018 are supported.`)
    console.log("---------------------------------")

    return yargs(hideBin(process.argv))
    .command('<input_file>', 'Patch a ISO / WBFS / DOL File', (yargs) => {
        return yargs
          .positional('input_file', {
            describe: 'Path to the input file',
            demandOption: true
          })
      }, (argv) => {
        return argv
    })
    .option("log-level", {
        type: "string",
        alias: "l",
        description: `Logging level`
    })
    .scriptName(project.name)
    .demandCommand()
    .showHelpOnFail()
    .parse()
}