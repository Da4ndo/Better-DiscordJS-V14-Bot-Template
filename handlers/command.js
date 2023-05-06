const fs = require("fs").promises;

module.exports = async (client) => {
  client.logger.debug(`Called handlers/command.js`);

  const loadedCommands = [];

  async function loadCommands(dir) {
    const files = await fs.readdir(dir, { withFileTypes: true });

    for (const file of files) {
      if (file.isDirectory()) {
        await loadCommands(`${dir}/${file.name}`);
      } else if (
        file.isFile() &&
        file.name.endsWith(".js") &&
        !file.name.startsWith("#")
      ) {
        const command = require(`../${dir}/${file.name}`);
        if (command) {
          client.commands.set(command.name, command);
          if (command.aliases && Array.isArray(command.aliases)) {
            command.aliases.forEach((alias) => {
              client.aliases.set(alias, command.name);
            });
          }
          loadedCommands.push(command.name);
          client.logger.info(`Loaded command: ${command.name}`);
        }
      }
    }
  }

  await loadCommands("./commands");

  console.log(`Loaded Commands: \n    ${loadedCommands.join("\n    ")}`);
};
