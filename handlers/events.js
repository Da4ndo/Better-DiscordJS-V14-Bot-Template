const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  client.logger.debug(`Called handlers/events.js`);
  const loadedEvents = [];

  fs.readdirSync("./events/")
    .filter((file) => file.endsWith(".js"))
    .forEach((event) => {
      require(`../events/${event}`);
      const eventName = path.basename(event, ".js");
      loadedEvents.push(eventName);
      client.logger.info(`Loaded event: ${eventName}`);
    });

  console.log(`Loaded Events: \n    ${loadedEvents.join("\n    ")}`);
};
