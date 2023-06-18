# PatcherWii

This tool will help you patch your **main.dol** files (which contains contents of the original servers) and replace the original servers with DanceParty ones.

## Building
You need Node.JS version 16 or higher to build the tool. Use the following commands below.
```
git clone https://github.com/dancepartyonline/patcher-wii.git && cd patcher-wii
```

### What is a DOL file and where can I find it?

DOL files contain game's source code and by patching it with our tool it replaces old server URLs with ours which builds a connection between you and the servers.

### Services explanation
- NAS: Authentication server by Nintendo
- WS: Game servers
- Tracking: Used by the game to report bugs, issues and errors. It helps us improve the service, you can comment it out if you want to.
- ECS: Store server

------------

You can extract the DOL file by dumping the files of your **legally** owned game. You can find it in `DATA/sys` folder.
For Dolphin users; you need to dump the ENTIRE disc from the root on.

### Games supported

- [X] Just Dance 2014
- [X] Just Dance 2015
- [X] Just Dance 2016
- [X] Just Dance 2017
- [X] Just Dance 2018

Just Dance 2019 and 2020 don't have World Dance Floor.

### Mods supported

- [X] Just Dance Japan *(by Yunyl)*

If you need further help, you can join our [Discord server.](https://discord.gg/msKfjrqfCm)