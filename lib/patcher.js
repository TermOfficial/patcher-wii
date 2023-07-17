const fs = require('fs');
const { resolve, dirname } = require('path');
const replace = require('buffer-replace');

module.exports = (inputDolPath) => {
  const logger = global.logger;

  // Exit in 5
  console.log("Exiting in 5 seconds...")
  setTimeout(function () {
    process.exit();
  }, 5000);
};