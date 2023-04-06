const client = require("..");
const fs = require("fs");
const path = require("path");

const language = {};

fs.readdirSync("./language/")
  .filter((file) => file.endsWith(".json") && !file.startsWith("#"))
  .forEach((file) => {
    language[file.replace(/\.json/, "")] = require(`../language/${file}`);
  });

module.exports = (index, languageCode = "en", replace = []) => {
  client.logger.debug(`Called lang.js <= (${index}, ${replace})`);
  const indexes = index.split(":");

  try {
    let str = language[languageCode][indexes[0]];
    indexes.splice(0, 1);

    indexes.forEach((element) => {
      str = str[element];
    });

    for (let i = 0; i < replace.length; i++) {
      str = str.replace(`{${i}}`, replace[i]);
    }
    return str;
  } catch (error) {
    client.logger.error(error);

    if (error instanceof TypeError) {
      const stackTrace = new Error().stack.split("\n")[2];
      const regex = /\((.*):(\d+):(\d+)\)$/;
      const matches = regex.exec(stackTrace);
      const filePath = matches[1].split(path.sep).pop();
      const line = matches[2];

      client.logger.info(`Language management error at ${filePath}:${line}.`);
    } else {
      client.logger.info("Error occurred in lang.js.");
    }

    return "Language Management Error";
  }
};
