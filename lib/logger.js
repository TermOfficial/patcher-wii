// Taken from DP Gameserver library but modified
const winston = require("winston");
const path = require("path");
const fs = require("fs");

const currentDate = (now = new Date()) => {
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
};

if (!process.pkg) fs.mkdirSync("./logs", { recursive: true }); // Create log folder if it doesn't exist

const levels = {
    error: 0,
    warn: 1,
    success: 2,
    info: 3,
    debug: 4
};
const colors = {
    error: "red",
    warn: "yellow",
    success: "green",
    info: "cyan",
    debug: "white"
};
winston.addColors(colors); // Add colors

const level = global.logLevel;

const format = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Date format
    winston.format.colorize({ all: true }), // All logs must have color
    // Define the format of the message with time, level and message
    winston.format.printf(
        (info) => `${info.timestamp} [${info.level}]: ${info.message}`,
    ),
);

const transports = [
    new winston.transports.Console(), // Allow the use the console to print the messages
];
// Only allow file logging if the tool isnt running in pkg
if (!process.pkg) transports.push(new winston.transports.File({ filename: `./logs/${currentDate()}.log` }));

const logger = winston.createLogger({
    level,
    levels,
    format,
    transports
});

module.exports = logger;