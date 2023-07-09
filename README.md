# PatcherWii

PatcherWii is a user-friendly tool designed to simplify the process of patching your **main.dol** files. These files contain the contents of the original servers, and PatcherWii enables you to replace them with DanceParty servers effortlessly.

## Usage

There are three different ways you can use PatcherWii:

### 1. Downloading Pre-built Releases

You can easily download pre-built releases of PatcherWii from the [GitHub releases page](https://github.com/dancepartyonline/patcher-wii/tags). Once downloaded, simply drag and drop your original DOL file onto the tool, and it will automatically patch it for you.

### 2. Running with Node.JS

To run PatcherWii with Node.JS, follow these steps:

1. Ensure you have Node.JS version 16 or higher installed on your system.
2. Clone the PatcherWii repository using the command: `git clone https://github.com/dancepartyonline/patcher-wii.git && cd patcher-wii`
3. Install the necessary dependencies with the command: `npm i`
4. Once the installation is complete, you can run the tool and view the available CLI options by executing `node index.js`.
5. To patch a bundle directly, use the following command: `node index.js path/to/original/main/dol`.
   For example: `node index.js C:/Users/Example/Desktop/DanceParty-2016/DATA/sys/main.dol`
6. PatcherWii will automatically patch your DOL file and save it, while also creating a backup for safety.

### 3. Building from Source

If you prefer to build PatcherWii from source, follow these steps:

1. Ensure you have Node.JS version 16 or higher installed on your system.
2. Install the "pkg" package globally using the command: `npm i -g pkg`.
3. Clone the PatcherWii repository using the command: `git clone https://github.com/dancepartyonline/patcher-wii.git && cd patcher-wii`.
4. Install the necessary dependencies with the command: `npm i`.
5. Build the tool using the command: `pkg .`.
6. Once the build process is complete, you can find the built packages in the `dist/` directory.

With these simple instructions, you can easily patch your main.dol files and replace the original servers with DanceParty servers using PatcherWii. Enjoy the enhanced experience!

### What is a DOL file and where can I find it?

A DOL file, contains the source code of a game. Our tool patches this file to replace the old server URLs with our own, establishing a connection between you and the servers.

### Services Explanation
- NAS: Authentication server by Nintendo
- WS: Game servers
  - Rhode: Handles leaderboards, online challengers, Just Dance Wall, and streamable maps
  - WDF: Facilitates World Dance Floor connections
- Tracking: Used by the game to report bugs, issues, and errors, helping us improve the service. You can comment it out if desired.
- Shop-ECS: In-game store server

------------

To obtain the DOL file, you can extract it by dumping the files from your **legally** owned game. Look for the DOL file in the `DATA/sys` folder. If you're using Dolphin emulator, you need to dump the entire disc starting from the root directory.

### Supported Games

- [X] Just Dance 2014
- [X] Just Dance 2015
- [X] Just Dance 2016
- [X] Just Dance 2017
- [X] Just Dance 2018

Please note that Just Dance 2019 and 2020 do not have World Dance Floor support.

### Supported Mods

- [X] Just Dance Japan *(by Yunyl)*

If you require further assistance, feel free to join our [Discord server](https://discord.gg/d4t6cqbmmk). We'll be happy to help!
